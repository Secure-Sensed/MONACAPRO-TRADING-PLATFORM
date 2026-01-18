#!/usr/bin/env python3
"""Seed database with initial data"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone
import uuid
from auth import hash_password

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'moncaplus')]

async def seed_data():
    print("🌱 Seeding database...")
    
    # Create admin user
    admin_exists = await db.users.find_one({'email': 'admin@moncaplus.com'})
    if not admin_exists:
        admin_id = f"user_{uuid.uuid4().hex[:12]}"
        admin_doc = {
            'user_id': admin_id,
            'email': 'admin@moncaplus.com',
            'full_name': 'Admin User',
            'password': hash_password('admin123'),
            'role': 'admin',
            'balance': 10000.0,
            'status': 'active',
            'created_at': datetime.now(timezone.utc)
        }
        await db.users.insert_one(admin_doc)
        print("✅ Admin user created (admin@moncaplus.com / admin123)")
    
    # Create test user
    test_user_exists = await db.users.find_one({'email': 'user@test.com'})
    if not test_user_exists:
        test_user_id = f"user_{uuid.uuid4().hex[:12]}"
        test_user_doc = {
            'user_id': test_user_id,
            'email': 'user@test.com',
            'full_name': 'Test User',
            'password': hash_password('password123'),
            'role': 'user',
            'balance': 5000.0,
            'status': 'active',
            'created_at': datetime.now(timezone.utc)
        }
        await db.users.insert_one(test_user_doc)
        print("✅ Test user created (user@test.com / password123)")
    
    # Seed traders
    traders_count = await db.traders.count_documents({})
    if traders_count == 0:
        traders = [
            {
                'trader_id': f"trader_{uuid.uuid4().hex[:12]}",
                'name': 'John Martinez',
                'image': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
                'profit': '+58.24%',
                'followers': 1250,
                'risk': 'Medium',
                'trades': 342,
                'win_rate': '76.71%',
                'is_active': True,
                'created_at': datetime.now(timezone.utc)
            },
            {
                'trader_id': f"trader_{uuid.uuid4().hex[:12]}",
                'name': 'Sarah Chen',
                'image': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
                'profit': '+92.15%',
                'followers': 2100,
                'risk': 'High',
                'trades': 521,
                'win_rate': '82.34%',
                'is_active': True,
                'created_at': datetime.now(timezone.utc)
            },
            {
                'trader_id': f"trader_{uuid.uuid4().hex[:12]}",
                'name': 'Michael Johnson',
                'image': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
                'profit': '+45.67%',
                'followers': 890,
                'risk': 'Low',
                'trades': 289,
                'win_rate': '71.23%',
                'is_active': True,
                'created_at': datetime.now(timezone.utc)
            },
            {
                'trader_id': f"trader_{uuid.uuid4().hex[:12]}",
                'name': 'Emma Williams',
                'image': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
                'profit': '+73.89%',
                'followers': 1780,
                'risk': 'Medium',
                'trades': 456,
                'win_rate': '79.45%',
                'is_active': True,
                'created_at': datetime.now(timezone.utc)
            }
        ]
        await db.traders.insert_many(traders)
        print(f"✅ {len(traders)} traders created")
    
    # Seed trading plans
    plans_count = await db.plans.count_documents({})
    if plans_count == 0:
        plans = [
            {
                'plan_id': f"plan_{uuid.uuid4().hex[:12]}",
                'name': 'Starter',
                'price': 500,
                'duration': '30 days',
                'features': [
                    'Copy up to 2 traders',
                    'Basic risk management',
                    'Email support',
                    'Market analysis reports'
                ],
                'popular': False,
                'is_active': True,
                'created_at': datetime.now(timezone.utc)
            },
            {
                'plan_id': f"plan_{uuid.uuid4().hex[:12]}",
                'name': 'Professional',
                'price': 2000,
                'duration': '30 days',
                'features': [
                    'Copy up to 5 traders',
                    'Advanced risk management',
                    'Priority support',
                    'Daily market analysis',
                    'Trading signals'
                ],
                'popular': True,
                'is_active': True,
                'created_at': datetime.now(timezone.utc)
            },
            {
                'plan_id': f"plan_{uuid.uuid4().hex[:12]}",
                'name': 'Elite',
                'price': 5000,
                'duration': '30 days',
                'features': [
                    'Copy unlimited traders',
                    'Custom risk management',
                    '24/7 VIP support',
                    'Personal account manager',
                    'Premium trading signals',
                    'Exclusive webinars'
                ],
                'popular': False,
                'is_active': True,
                'created_at': datetime.now(timezone.utc)
            }
        ]
        await db.plans.insert_many(plans)
        print(f"✅ {len(plans)} plans created")
    
    print("🎉 Database seeding completed!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_data())
