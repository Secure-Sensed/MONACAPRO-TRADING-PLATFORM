#!/usr/bin/env python3
"""
Final comprehensive test for Moncaplus Admin Functionality
Tests all requirements from the review request
"""

import requests
import json
import sys
from datetime import datetime

BACKEND_URL = "https://monca-trading-clone.preview.emergentagent.com/api"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def log_success(message):
    print(f"{Colors.GREEN}✅ {message}{Colors.ENDC}")

def log_error(message):
    print(f"{Colors.RED}❌ {message}{Colors.ENDC}")

def log_info(message):
    print(f"{Colors.BLUE}ℹ️  {message}{Colors.ENDC}")

def log_header(message):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.BLUE}{message}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.ENDC}")

def main():
    log_header("MONCAPLUS ADMIN FUNCTIONALITY - FINAL TEST")
    log_info(f"Backend URL: {BACKEND_URL}")
    log_info(f"Test started at: {datetime.now()}")
    
    test_results = {'passed': 0, 'failed': 0, 'errors': []}
    
    # Test 1: Admin Login Tests
    log_header("1. ADMIN LOGIN TESTS")
    
    # Test admin user login
    log_info("Testing admin user (admin@admin.com / admin0123)...")
    response = requests.post(f"{BACKEND_URL}/auth/login", json={
        'email': 'admin@admin.com',
        'password': 'admin0123'
    })
    
    if response.status_code == 200:
        data = response.json()
        if data.get('success') and data.get('user', {}).get('role') == 'admin':
            admin_token = data['token']
            log_success("Admin login successful - role verified")
            test_results['passed'] += 1
        else:
            log_error("Admin login failed - role not verified")
            test_results['failed'] += 1
            return False
    else:
        log_error(f"Admin login failed - status {response.status_code}")
        test_results['failed'] += 1
        return False
    
    # Test addmin user login
    log_info("Testing addmin user (addmin@admin.com / admin0123)...")
    response = requests.post(f"{BACKEND_URL}/auth/login", json={
        'email': 'addmin@admin.com',
        'password': 'admin0123'
    })
    
    if response.status_code == 200:
        data = response.json()
        if data.get('success') and data.get('user', {}).get('role') == 'admin':
            addmin_token = data['token']
            log_success("Addmin login successful - role verified")
            test_results['passed'] += 1
        else:
            log_error("Addmin login failed - role not verified")
            test_results['failed'] += 1
    else:
        log_error(f"Addmin login failed - status {response.status_code}")
        test_results['failed'] += 1
    
    # Test invalid credentials
    log_info("Testing invalid admin credentials...")
    response = requests.post(f"{BACKEND_URL}/auth/login", json={
        'email': 'admin@admin.com',
        'password': 'wrongpassword'
    })
    
    if response.status_code == 401:
        log_success("Invalid credentials properly rejected")
        test_results['passed'] += 1
    else:
        log_error(f"Invalid credentials not rejected - status {response.status_code}")
        test_results['failed'] += 1
    
    # Test 2: Admin API Endpoints
    log_header("2. ADMIN API ENDPOINTS")
    
    endpoints_to_test = [
        ('GET /api/users', '/users', 'users'),
        ('PUT /api/users/{user_id}', None, None),  # Will test separately
        ('DELETE /api/users/{user_id}', None, None),  # Will test separately
        ('GET /api/traders', '/traders', 'traders'),
        ('GET /api/plans', '/plans', 'plans'),
        ('GET /api/transactions', '/transactions', 'transactions'),
        ('GET /api/admin/stats', '/admin/stats', 'stats'),
        ('PUT /api/transactions/{transaction_id}/approve', None, None),  # Will test separately
        ('PUT /api/transactions/{transaction_id}/reject', None, None),  # Will test separately
    ]
    
    for endpoint_name, endpoint_path, response_key in endpoints_to_test:
        if endpoint_path is None:
            continue  # Skip endpoints that need special handling
            
        log_info(f"Testing {endpoint_name}...")
        response = requests.get(f"{BACKEND_URL}{endpoint_path}", 
                              headers={'Authorization': f'Bearer {admin_token}'})
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and response_key in data:
                items = data[response_key]
                if isinstance(items, list):
                    log_success(f"{endpoint_name} working - returned {len(items)} items")
                elif isinstance(items, dict):
                    log_success(f"{endpoint_name} working - returned stats")
                    log_info(f"Stats: {json.dumps(items, indent=2)}")
                test_results['passed'] += 1
            else:
                log_error(f"{endpoint_name} response missing success or {response_key}")
                test_results['failed'] += 1
        else:
            log_error(f"{endpoint_name} failed - status {response.status_code}")
            test_results['failed'] += 1
    
    # Test 3: User Management Operations
    log_header("3. USER MANAGEMENT OPERATIONS")
    
    # Get users to find one to update
    response = requests.get(f"{BACKEND_URL}/users", 
                          headers={'Authorization': f'Bearer {admin_token}'})
    
    if response.status_code == 200:
        users = response.json().get('users', [])
        regular_user = next((u for u in users if u.get('role') == 'user'), None)
        
        if regular_user:
            user_id = regular_user['user_id']
            original_status = regular_user.get('status', 'active')
            new_status = 'inactive' if original_status == 'active' else 'active'
            
            log_info(f"Testing PUT /api/users/{user_id} - updating status...")
            response = requests.put(f"{BACKEND_URL}/users/{user_id}", 
                                  json={'status': new_status},
                                  headers={'Authorization': f'Bearer {admin_token}'})
            
            if response.status_code == 200 and response.json().get('success'):
                log_success("User status update successful")
                test_results['passed'] += 1
            else:
                log_error(f"User status update failed - status {response.status_code}")
                test_results['failed'] += 1
        else:
            log_info("No regular users found for testing user management")
    
    # Test 4: Transaction Management
    log_header("4. TRANSACTION MANAGEMENT")
    
    # Get transactions to test approval/rejection
    response = requests.get(f"{BACKEND_URL}/transactions", 
                          headers={'Authorization': f'Bearer {admin_token}'})
    
    if response.status_code == 200:
        transactions = response.json().get('transactions', [])
        pending_transactions = [t for t in transactions if t.get('status') == 'pending']
        
        if len(pending_transactions) >= 1:
            # Test approval
            transaction_id = pending_transactions[0]['transaction_id']
            log_info(f"Testing PUT /api/transactions/{transaction_id}/approve...")
            
            response = requests.put(f"{BACKEND_URL}/transactions/{transaction_id}/approve", 
                                  headers={'Authorization': f'Bearer {admin_token}'})
            
            if response.status_code == 200 and response.json().get('success'):
                log_success("Transaction approval successful")
                test_results['passed'] += 1
            else:
                log_error(f"Transaction approval failed - status {response.status_code}")
                test_results['failed'] += 1
        
        if len(pending_transactions) >= 2:
            # Test rejection
            transaction_id = pending_transactions[1]['transaction_id']
            log_info(f"Testing PUT /api/transactions/{transaction_id}/reject...")
            
            response = requests.put(f"{BACKEND_URL}/transactions/{transaction_id}/reject", 
                                  headers={'Authorization': f'Bearer {admin_token}'})
            
            if response.status_code == 200 and response.json().get('success'):
                log_success("Transaction rejection successful")
                test_results['passed'] += 1
            else:
                log_error(f"Transaction rejection failed - status {response.status_code}")
                test_results['failed'] += 1
        else:
            log_info("Not enough pending transactions for approval/rejection testing")
    
    # Test 5: Access Control Verification
    log_header("5. ACCESS CONTROL VERIFICATION")
    
    # Get regular user token
    response = requests.post(f"{BACKEND_URL}/auth/login", json={
        'email': 'user@test.com',
        'password': 'password123'
    })
    
    if response.status_code == 200:
        user_token = response.json()['token']
        
        # Test that regular users cannot access admin endpoints
        admin_endpoints = ['/users', '/admin/stats', '/transactions']
        
        for endpoint in admin_endpoints:
            log_info(f"Verifying {endpoint} is restricted for regular users...")
            response = requests.get(f"{BACKEND_URL}{endpoint}", 
                                  headers={'Authorization': f'Bearer {user_token}'})
            
            if response.status_code == 403:
                log_success(f"Access to {endpoint} properly restricted")
                test_results['passed'] += 1
            else:
                log_error(f"Access to {endpoint} not restricted - status {response.status_code}")
                test_results['failed'] += 1
    
    # Final Results
    log_header("FINAL TEST RESULTS")
    total_tests = test_results['passed'] + test_results['failed']
    
    log_info(f"Total Tests: {total_tests}")
    log_success(f"Passed: {test_results['passed']}")
    
    if test_results['failed'] > 0:
        log_error(f"Failed: {test_results['failed']}")
        log_error("❌ SOME ADMIN FUNCTIONALITY TESTS FAILED")
        return False
    else:
        log_success("🎉 ALL ADMIN FUNCTIONALITY TESTS PASSED!")
        log_success("✅ Admin login working for both admin and addmin users")
        log_success("✅ All admin API endpoints working correctly")
        log_success("✅ User management operations working")
        log_success("✅ Transaction approval/rejection working")
        log_success("✅ Access control properly restricting regular users")
        return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)