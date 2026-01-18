from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Cookie
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
from pathlib import Path
from datetime import datetime, timedelta, timezone
from typing import Optional, List

from models import (
    User, UserCreate, UserLogin, UserSession,
    Trader, TraderCreate,
    CopyTrade, CopyTradeCreate,
    Transaction, TransactionCreate,
    Plan, PlanCreate,
    DashboardStats,
    UserRole, UserStatus, TransactionStatus
)
from auth import (
    hash_password, verify_password, create_jwt_token,
    get_current_user, require_admin, exchange_session_id,
    generate_user_id, generate_session_token
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'moncaplus')]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# AUTH ENDPOINTS

@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    """Register a new user with email and password"""
    existing_user = await db.users.find_one({'email': user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail='Email already registered')
    
    user_id = generate_user_id()
    hashed_pwd = hash_password(user_data.password)
    
    user_doc = {
        'user_id': user_id,
        'email': user_data.email,
        'full_name': user_data.full_name,
        'password': hashed_pwd,
        'role': UserRole.USER.value,
        'balance': 0.0,
        'status': UserStatus.ACTIVE.value,
        'created_at': datetime.now(timezone.utc)
    }
    
    await db.users.insert_one(user_doc)
    
    session_token = generate_session_token()
    session_doc = {
        'user_id': user_id,
        'session_token': session_token,
        'expires_at': datetime.now(timezone.utc) + timedelta(days=7),
        'created_at': datetime.now(timezone.utc)
    }
    await db.user_sessions.insert_one(session_doc)
    
    user = await db.users.find_one({'user_id': user_id}, {'_id': 0, 'password': 0})
    
    return {
        'success': True,
        'message': 'User registered successfully',
        'user': user,
        'token': session_token
    }

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    """Login with email and password"""
    user_doc = await db.users.find_one({'email': credentials.email})
    if not user_doc:
        raise HTTPException(status_code=401, detail='Invalid credentials')
    
    if not verify_password(credentials.password, user_doc['password']):
        raise HTTPException(status_code=401, detail='Invalid credentials')
    
    session_token = generate_session_token()
    session_doc = {
        'user_id': user_doc['user_id'],
        'session_token': session_token,
        'expires_at': datetime.now(timezone.utc) + timedelta(days=7),
        'created_at': datetime.now(timezone.utc)
    }
    await db.user_sessions.insert_one(session_doc)
    
    user = await db.users.find_one({'user_id': user_doc['user_id']}, {'_id': 0, 'password': 0})
    
    return {
        'success': True,
        'message': 'Login successful',
        'user': user,
        'token': session_token
    }

@api_router.post("/auth/google")
async def google_auth(request: Request):
    """Handle Google OAuth via Emergent Auth"""
    body = await request.json()
    session_id = body.get('session_id')
    
    if not session_id:
        raise HTTPException(status_code=400, detail='session_id required')
    
    user_data = await exchange_session_id(session_id)
    
    user_doc = await db.users.find_one({'email': user_data['email']})
    
    if user_doc:
        user_id = user_doc['user_id']
        await db.users.update_one(
            {'user_id': user_id},
            {
                '$set': {
                    'full_name': user_data['name'],
                    'picture': user_data.get('picture'),
                    'updated_at': datetime.now(timezone.utc)
                }
            }
        )
    else:
        user_id = generate_user_id()
        new_user_doc = {
            'user_id': user_id,
            'email': user_data['email'],
            'full_name': user_data['name'],
            'google_id': user_data['id'],
            'picture': user_data.get('picture'),
            'role': UserRole.USER.value,
            'balance': 0.0,
            'status': UserStatus.ACTIVE.value,
            'created_at': datetime.now(timezone.utc)
        }
        await db.users.insert_one(new_user_doc)
    
    session_token = user_data['session_token']
    session_doc = {
        'user_id': user_id,
        'session_token': session_token,
        'expires_at': datetime.now(timezone.utc) + timedelta(days=7),
        'created_at': datetime.now(timezone.utc)
    }
    await db.user_sessions.insert_one(session_doc)
    
    user = await db.users.find_one({'user_id': user_id}, {'_id': 0, 'password': 0})
    
    return {
        'success': True,
        'message': 'Google authentication successful',
        'user': user,
        'token': session_token
    }

@api_router.get("/auth/me")
async def get_me(request: Request, session_token: Optional[str] = Cookie(None)):
    """Get current user info"""
    user = await get_current_user(request, session_token, db)
    return {
        'success': True,
        'user': user
    }

@api_router.post("/auth/logout")
async def logout(request: Request, session_token: Optional[str] = Cookie(None)):
    """Logout user"""
    token = session_token
    if not token:
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.replace('Bearer ', '')
    
    if token:
        await db.user_sessions.delete_many({'session_token': token})
    
    return {'success': True, 'message': 'Logged out successfully'}

# USER MANAGEMENT

@api_router.get("/users")
async def get_users(request: Request, session_token: Optional[str] = Cookie(None)):
    """Get all users (admin only)"""
    await require_admin(request, session_token, db)
    
    users = await db.users.find({}, {'_id': 0, 'password': 0}).to_list(1000)
    return {
        'success': True,
        'users': users
    }

@api_router.put("/users/{user_id}")
async def update_user(user_id: str, request: Request, session_token: Optional[str] = Cookie(None)):
    """Update user (admin only)"""
    await require_admin(request, session_token, db)
    
    body = await request.json()
    update_data = {}
    
    if 'status' in body:
        update_data['status'] = body['status']
    if 'balance' in body:
        update_data['balance'] = body['balance']
    if 'role' in body:
        update_data['role'] = body['role']
    
    if update_data:
        update_data['updated_at'] = datetime.now(timezone.utc)
        await db.users.update_one({'user_id': user_id}, {'$set': update_data})
    
    return {'success': True, 'message': 'User updated'}

@api_router.delete("/users/{user_id}")
async def delete_user(user_id: str, request: Request, session_token: Optional[str] = Cookie(None)):
    """Delete user (admin only)"""
    await require_admin(request, session_token, db)
    
    await db.users.delete_one({'user_id': user_id})
    await db.user_sessions.delete_many({'user_id': user_id})
    await db.copy_trades.delete_many({'user_id': user_id})
    await db.transactions.delete_many({'user_id': user_id})
    
    return {'success': True, 'message': 'User deleted'}

# TRADER ENDPOINTS

@api_router.get("/traders")
async def get_traders():
    """Get all active traders"""
    traders = await db.traders.find({'is_active': True}, {'_id': 0}).to_list(100)
    return {
        'success': True,
        'traders': traders
    }

@api_router.post("/traders")
async def create_trader(trader_data: TraderCreate, request: Request, session_token: Optional[str] = Cookie(None)):
    """Create trader (admin only)"""
    await require_admin(request, session_token, db)
    
    trader_id = f"trader_{uuid.uuid4().hex[:12]}"
    trader_doc = {
        'trader_id': trader_id,
        **trader_data.dict(),
        'followers': 0,
        'trades': 0,
        'is_active': True,
        'created_at': datetime.now(timezone.utc)
    }
    
    await db.traders.insert_one(trader_doc)
    trader = await db.traders.find_one({'trader_id': trader_id}, {'_id': 0})
    
    return {
        'success': True,
        'trader': trader
    }

# DASHBOARD

@api_router.get("/dashboard/stats")
async def get_dashboard_stats(request: Request, session_token: Optional[str] = Cookie(None)):
    """Get dashboard statistics for current user"""
    user = await get_current_user(request, session_token, db)
    
    active_copies = await db.copy_trades.count_documents({
        'user_id': user['user_id'],
        'status': 'active'
    })
    
    total_trades = await db.transactions.count_documents({
        'user_id': user['user_id'],
        'type': 'trade'
    })
    
    copy_trades = await db.copy_trades.find({
        'user_id': user['user_id'],
        'status': 'active'
    }).to_list(100)
    
    total_profit = sum(ct.get('current_profit', 0) for ct in copy_trades)
    profit_percentage = (total_profit / user['balance'] * 100) if user['balance'] > 0 else 0
    
    return {
        'success': True,
        'portfolio': {
            'balance': user['balance'],
            'profit': total_profit,
            'profit_percentage': round(profit_percentage, 2),
            'active_copies': active_copies,
            'total_trades': total_trades
        }
    }

# PLANS

@api_router.get("/plans")
async def get_plans():
    """Get all active plans"""
    plans = await db.plans.find({'is_active': True}, {'_id': 0}).to_list(100)
    return {
        'success': True,
        'plans': plans
    }

# TRANSACTIONS

@api_router.get("/transactions")
async def get_transactions(request: Request, session_token: Optional[str] = Cookie(None)):
    """Get all transactions (admin only)"""
    await require_admin(request, session_token, db)
    
    transactions = await db.transactions.find({}, {'_id': 0}).to_list(1000)
    return {
        'success': True,
        'transactions': transactions
    }

@api_router.put("/transactions/{transaction_id}/approve")
async def approve_transaction(transaction_id: str, request: Request, session_token: Optional[str] = Cookie(None)):
    """Approve a transaction (admin only)"""
    admin_user = await require_admin(request, session_token, db)
    
    result = await db.transactions.update_one(
        {'transaction_id': transaction_id},
        {
            '$set': {
                'status': 'completed',
                'processed_by': admin_user['user_id'],
                'processed_at': datetime.now(timezone.utc)
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail='Transaction not found')
    
    return {'success': True, 'message': 'Transaction approved'}

@api_router.put("/transactions/{transaction_id}/reject")
async def reject_transaction(transaction_id: str, request: Request, session_token: Optional[str] = Cookie(None)):
    """Reject a transaction (admin only)"""
    admin_user = await require_admin(request, session_token, db)
    
    result = await db.transactions.update_one(
        {'transaction_id': transaction_id},
        {
            '$set': {
                'status': 'rejected',
                'processed_by': admin_user['user_id'],
                'processed_at': datetime.now(timezone.utc)
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail='Transaction not found')
    
    return {'success': True, 'message': 'Transaction rejected'}

# ADMIN STATS

@api_router.get("/admin/stats")
async def get_admin_stats(request: Request, session_token: Optional[str] = Cookie(None)):
    """Get admin dashboard statistics"""
    await require_admin(request, session_token, db)
    
    total_users = await db.users.count_documents({'role': 'user'})
    total_traders = await db.traders.count_documents({'is_active': True})
    total_transactions = await db.transactions.count_documents({})
    pending_transactions = await db.transactions.count_documents({'status': 'pending'})
    total_plans = await db.plans.count_documents({'is_active': True})
    
    # Calculate total platform balance
    users = await db.users.find({'role': 'user'}, {'balance': 1}).to_list(1000)
    total_balance = sum(user.get('balance', 0) for user in users)
    
    return {
        'success': True,
        'stats': {
            'total_users': total_users,
            'total_traders': total_traders,
            'total_transactions': total_transactions,
            'pending_transactions': pending_transactions,
            'total_plans': total_plans,
            'total_platform_balance': total_balance
        }
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
