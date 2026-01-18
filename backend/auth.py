import bcrypt
import jwt
import uuid
import httpx
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, Request, Cookie
from typing import Optional
import os

JWT_SECRET = os.getenv('JWT_SECRET', 'your_secret_key_change_in_production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_DAYS = 7

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_jwt_token(user_id: str, email: str, role: str) -> str:
    """Create a JWT token"""
    payload = {
        'user_id': user_id,
        'email': email,
        'role': role,
        'exp': datetime.now(timezone.utc) + timedelta(days=JWT_EXPIRATION_DAYS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_jwt_token(token: str) -> dict:
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail='Token expired')
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail='Invalid token')

async def get_current_user(request: Request, session_token: Optional[str] = Cookie(None), db = None):
    """Get current user from session token (cookie or Authorization header)"""
    # REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    
    # Try cookie first
    token = session_token
    
    # Fallback to Authorization header
    if not token:
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.replace('Bearer ', '')
    
    if not token:
        raise HTTPException(status_code=401, detail='Not authenticated')
    
    # Check session in database
    session_doc = await db.user_sessions.find_one(
        {'session_token': token},
        {'_id': 0}
    )
    
    if not session_doc:
        raise HTTPException(status_code=401, detail='Invalid session')
    
    # Check expiration
    expires_at = session_doc['expires_at']
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail='Session expired')
    
    # Get user
    user_doc = await db.users.find_one(
        {'user_id': session_doc['user_id']},
        {'_id': 0, 'password': 0}
    )
    
    if not user_doc:
        raise HTTPException(status_code=401, detail='User not found')
    
    return user_doc

async def require_admin(request: Request, session_token: Optional[str] = Cookie(None), db = None):
    """Require admin role"""
    user = await get_current_user(request, session_token, db)
    if user['role'] != 'admin':
        raise HTTPException(status_code=403, detail='Admin access required')
    return user

async def exchange_session_id(session_id: str) -> dict:
    """Exchange session_id for user data from Emergent Auth"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            'https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data',
            headers={'X-Session-ID': session_id}
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=401, detail='Invalid session ID')
        
        return response.json()

def generate_user_id() -> str:
    """Generate a unique user ID"""
    return f"user_{uuid.uuid4().hex[:12]}"

def generate_session_token() -> str:
    """Generate a unique session token"""
    return f"session_{uuid.uuid4().hex}"
