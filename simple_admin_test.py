#!/usr/bin/env python3
"""
Simple test to verify admin access restrictions
"""

import requests
import json

BACKEND_URL = "https://monacaptrade.preview.emergentagent.com/api"

def test_admin_restrictions():
    print("=== Testing Admin Access Restrictions ===")
    
    # Get regular user token
    print("1. Getting regular user token...")
    response = requests.post(f"{BACKEND_URL}/auth/login", json={
        'email': 'user@test.com',
        'password': 'password123'
    })
    
    if response.status_code != 200:
        print(f"❌ Failed to login regular user: {response.status_code}")
        return False
    
    user_token = response.json()['token']
    print(f"✅ Got user token: {user_token[:20]}...")
    
    # Test admin endpoints
    admin_endpoints = ['/users', '/admin/stats', '/transactions']
    
    for endpoint in admin_endpoints:
        print(f"\n2. Testing {endpoint} with regular user token...")
        
        try:
            response = requests.get(f"{BACKEND_URL}{endpoint}", 
                                  headers={'Authorization': f'Bearer {user_token}'},
                                  timeout=5)
            
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text[:100]}")
            
            if response.status_code == 403:
                print(f"✅ {endpoint} properly restricted")
            else:
                print(f"❌ {endpoint} not properly restricted - got {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Error testing {endpoint}: {e}")
            return False
    
    print("\n✅ All admin endpoints properly restricted!")
    return True

if __name__ == "__main__":
    success = test_admin_restrictions()
    exit(0 if success else 1)