#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Moncaplus Trading Platform
Tests all admin functionality and endpoints
"""

import requests
import json
import sys
from datetime import datetime

# Get backend URL from frontend env
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

def log_warning(message):
    print(f"{Colors.YELLOW}⚠️  {message}{Colors.ENDC}")

def log_info(message):
    print(f"{Colors.BLUE}ℹ️  {message}{Colors.ENDC}")

def log_header(message):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.BLUE}{message}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.ENDC}")

class AdminTester:
    def __init__(self):
        self.admin_token = None
        self.addmin_token = None
        self.test_results = {
            'passed': 0,
            'failed': 0,
            'errors': []
        }

    def make_request(self, method, endpoint, data=None, token=None, expect_status=200):
        """Make HTTP request with proper error handling"""
        url = f"{BACKEND_URL}{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if token:
            headers['Authorization'] = f'Bearer {token}'
        
        try:
            if method.upper() == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method.upper() == 'POST':
                response = requests.post(url, headers=headers, json=data, timeout=10)
            elif method.upper() == 'PUT':
                response = requests.put(url, headers=headers, json=data, timeout=10)
            elif method.upper() == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            if response.status_code == expect_status:
                self.test_results['passed'] += 1
                return response
            else:
                self.test_results['failed'] += 1
                error_msg = f"{method} {endpoint} - Expected {expect_status}, got {response.status_code}"
                if response.text:
                    error_msg += f" - {response.text[:200]}"
                self.test_results['errors'].append(error_msg)
                log_error(error_msg)
                return response
                
        except requests.exceptions.RequestException as e:
            self.test_results['failed'] += 1
            error_msg = f"{method} {endpoint} - Request failed: {str(e)}"
            self.test_results['errors'].append(error_msg)
            log_error(error_msg)
            return None

    def test_admin_login(self):
        """Test admin login functionality"""
        log_header("TESTING ADMIN LOGIN")
        
        # Test admin user login
        log_info("Testing admin@admin.com login...")
        response = self.make_request('POST', '/auth/login', {
            'email': 'admin@admin.com',
            'password': 'admin0123'
        })
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get('success') and data.get('token'):
                self.admin_token = data['token']
                user = data.get('user', {})
                if user.get('role') == 'admin':
                    log_success("Admin login successful - role verified")
                else:
                    log_error(f"Admin role not returned - got: {user.get('role')}")
            else:
                log_error("Admin login response missing token or success flag")
        
        # Test addmin user login
        log_info("Testing addmin@admin.com login...")
        response = self.make_request('POST', '/auth/login', {
            'email': 'addmin@admin.com',
            'password': 'admin0123'
        })
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get('success') and data.get('token'):
                self.addmin_token = data['token']
                user = data.get('user', {})
                if user.get('role') == 'admin':
                    log_success("Addmin login successful - role verified")
                else:
                    log_error(f"Addmin role not returned - got: {user.get('role')}")
            else:
                log_error("Addmin login response missing token or success flag")
        
        # Test invalid credentials
        log_info("Testing invalid admin credentials...")
        response = self.make_request('POST', '/auth/login', {
            'email': 'admin@admin.com',
            'password': 'wrongpassword'
        }, expect_status=401)
        
        if response and response.status_code == 401:
            log_success("Invalid credentials properly rejected")

    def test_admin_endpoints(self):
        """Test all admin-only endpoints"""
        if not self.admin_token:
            log_error("No admin token available - skipping admin endpoint tests")
            return
        
        log_header("TESTING ADMIN ENDPOINTS")
        
        # Test GET /api/users
        log_info("Testing GET /api/users...")
        response = self.make_request('GET', '/users', token=self.admin_token)
        if response and response.status_code == 200:
            data = response.json()
            if data.get('success') and 'users' in data:
                users = data['users']
                log_success(f"Users endpoint working - returned {len(users)} users")
                
                # Check if admin users are in the list
                admin_found = any(u.get('role') == 'admin' for u in users)
                if admin_found:
                    log_success("Admin users found in users list")
                else:
                    log_warning("No admin users found in users list")
            else:
                log_error("Users endpoint response missing success or users field")
        
        # Test GET /api/traders
        log_info("Testing GET /api/traders...")
        response = self.make_request('GET', '/traders', token=self.admin_token)
        if response and response.status_code == 200:
            data = response.json()
            if data.get('success') and 'traders' in data:
                traders = data['traders']
                log_success(f"Traders endpoint working - returned {len(traders)} traders")
            else:
                log_error("Traders endpoint response missing success or traders field")
        
        # Test GET /api/plans
        log_info("Testing GET /api/plans...")
        response = self.make_request('GET', '/plans', token=self.admin_token)
        if response and response.status_code == 200:
            data = response.json()
            if data.get('success') and 'plans' in data:
                plans = data['plans']
                log_success(f"Plans endpoint working - returned {len(plans)} plans")
            else:
                log_error("Plans endpoint response missing success or plans field")
        
        # Test GET /api/transactions
        log_info("Testing GET /api/transactions...")
        response = self.make_request('GET', '/transactions', token=self.admin_token)
        if response and response.status_code == 200:
            data = response.json()
            if data.get('success') and 'transactions' in data:
                transactions = data['transactions']
                log_success(f"Transactions endpoint working - returned {len(transactions)} transactions")
                
                # Store a transaction ID for approval/rejection tests
                if transactions:
                    self.test_transaction_id = transactions[0].get('transaction_id')
            else:
                log_error("Transactions endpoint response missing success or transactions field")
        
        # Test GET /api/admin/stats
        log_info("Testing GET /api/admin/stats...")
        response = self.make_request('GET', '/admin/stats', token=self.admin_token)
        if response and response.status_code == 200:
            data = response.json()
            if data.get('success') and 'stats' in data:
                stats = data['stats']
                required_fields = ['total_users', 'total_traders', 'total_transactions', 
                                 'pending_transactions', 'total_plans', 'total_platform_balance']
                missing_fields = [field for field in required_fields if field not in stats]
                
                if not missing_fields:
                    log_success("Admin stats endpoint working - all required fields present")
                    log_info(f"Stats: {json.dumps(stats, indent=2)}")
                else:
                    log_error(f"Admin stats missing fields: {missing_fields}")
            else:
                log_error("Admin stats response missing success or stats field")

    def test_user_management(self):
        """Test user management endpoints"""
        if not self.admin_token:
            log_error("No admin token available - skipping user management tests")
            return
        
        log_header("TESTING USER MANAGEMENT")
        
        # First get a regular user to test with
        response = self.make_request('GET', '/users', token=self.admin_token)
        if not response or response.status_code != 200:
            log_error("Cannot get users list for testing")
            return
        
        users = response.json().get('users', [])
        regular_user = next((u for u in users if u.get('role') == 'user'), None)
        
        if not regular_user:
            log_warning("No regular users found for testing user management")
            return
        
        user_id = regular_user['user_id']
        original_status = regular_user.get('status', 'active')
        
        # Test PUT /api/users/{user_id} - Update user status
        log_info(f"Testing PUT /api/users/{user_id} - updating status...")
        new_status = 'inactive' if original_status == 'active' else 'active'
        
        response = self.make_request('PUT', f'/users/{user_id}', {
            'status': new_status
        }, token=self.admin_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get('success'):
                log_success("User status update successful")
                
                # Verify the update by getting users again
                verify_response = self.make_request('GET', '/users', token=self.admin_token)
                if verify_response and verify_response.status_code == 200:
                    updated_users = verify_response.json().get('users', [])
                    updated_user = next((u for u in updated_users if u['user_id'] == user_id), None)
                    if updated_user and updated_user.get('status') == new_status:
                        log_success("User status update verified")
                    else:
                        log_error("User status update not reflected in database")
            else:
                log_error("User update response missing success flag")
        
        # Test DELETE /api/users/{user_id} - We'll skip this to avoid deleting test data
        log_info("Skipping user deletion test to preserve test data")

    def test_transaction_management(self):
        """Test transaction approval/rejection"""
        if not self.admin_token:
            log_error("No admin token available - skipping transaction management tests")
            return
        
        log_header("TESTING TRANSACTION MANAGEMENT")
        
        # Get transactions to find one to test with
        response = self.make_request('GET', '/transactions', token=self.admin_token)
        if not response or response.status_code != 200:
            log_error("Cannot get transactions list for testing")
            return
        
        transactions = response.json().get('transactions', [])
        pending_transaction = next((t for t in transactions if t.get('status') == 'pending'), None)
        
        if not pending_transaction:
            log_warning("No pending transactions found for testing approval/rejection")
            return
        
        transaction_id = pending_transaction['transaction_id']
        
        # Test PUT /api/transactions/{transaction_id}/approve
        log_info(f"Testing transaction approval for {transaction_id}...")
        response = self.make_request('PUT', f'/transactions/{transaction_id}/approve', 
                                   token=self.admin_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get('success'):
                log_success("Transaction approval successful")
                
                # Verify the approval
                verify_response = self.make_request('GET', '/transactions', token=self.admin_token)
                if verify_response and verify_response.status_code == 200:
                    updated_transactions = verify_response.json().get('transactions', [])
                    updated_transaction = next((t for t in updated_transactions 
                                              if t['transaction_id'] == transaction_id), None)
                    if updated_transaction and updated_transaction.get('status') == 'completed':
                        log_success("Transaction approval verified")
                    else:
                        log_error("Transaction approval not reflected in database")
            else:
                log_error("Transaction approval response missing success flag")
        
        # Find another pending transaction for rejection test
        response = self.make_request('GET', '/transactions', token=self.admin_token)
        if response and response.status_code == 200:
            transactions = response.json().get('transactions', [])
            pending_transaction = next((t for t in transactions if t.get('status') == 'pending'), None)
            
            if pending_transaction:
                transaction_id = pending_transaction['transaction_id']
                
                # Test PUT /api/transactions/{transaction_id}/reject
                log_info(f"Testing transaction rejection for {transaction_id}...")
                response = self.make_request('PUT', f'/transactions/{transaction_id}/reject', 
                                           token=self.admin_token)
                
                if response and response.status_code == 200:
                    data = response.json()
                    if data.get('success'):
                        log_success("Transaction rejection successful")
                    else:
                        log_error("Transaction rejection response missing success flag")

    def test_non_admin_access(self):
        """Test that non-admin users cannot access admin endpoints"""
        log_header("TESTING NON-ADMIN ACCESS RESTRICTIONS")
        
        # Create a regular user session for testing
        log_info("Creating regular user for access restriction testing...")
        response = self.make_request('POST', '/auth/login', {
            'email': 'user@test.com',
            'password': 'password123'
        })
        
        if not response or response.status_code != 200:
            log_error("Cannot create regular user session for testing")
            return
        
        user_token = response.json().get('token')
        if not user_token:
            log_error("No token received for regular user")
            return
        
        # Test admin endpoints with regular user token (should fail)
        admin_endpoints = [
            '/users',
            '/admin/stats',
            '/transactions'
        ]
        
        for endpoint in admin_endpoints:
            log_info(f"Testing {endpoint} with regular user token (should fail)...")
            response = self.make_request('GET', endpoint, token=user_token, expect_status=403)
            if response and response.status_code == 403:
                log_success(f"Access to {endpoint} properly restricted for regular users")
            elif response:
                log_error(f"Regular user can access {endpoint} - got status {response.status_code}: {response.text[:100]}")
            else:
                log_error(f"No response received for {endpoint}")

    def run_all_tests(self):
        """Run all admin functionality tests"""
        log_header("MONCAPLUS ADMIN FUNCTIONALITY TESTING")
        log_info(f"Backend URL: {BACKEND_URL}")
        log_info(f"Test started at: {datetime.now()}")
        
        try:
            self.test_admin_login()
            self.test_admin_endpoints()
            self.test_user_management()
            self.test_transaction_management()
            self.test_non_admin_access()
            
        except Exception as e:
            log_error(f"Test execution failed: {str(e)}")
            self.test_results['failed'] += 1
            self.test_results['errors'].append(f"Test execution error: {str(e)}")
        
        # Print final results
        log_header("TEST RESULTS SUMMARY")
        total_tests = self.test_results['passed'] + self.test_results['failed']
        
        if self.test_results['passed'] > 0:
            log_success(f"Passed: {self.test_results['passed']}/{total_tests}")
        
        if self.test_results['failed'] > 0:
            log_error(f"Failed: {self.test_results['failed']}/{total_tests}")
            
            if self.test_results['errors']:
                log_header("DETAILED ERROR REPORT")
                for i, error in enumerate(self.test_results['errors'], 1):
                    log_error(f"{i}. {error}")
        
        if self.test_results['failed'] == 0:
            log_success("🎉 ALL ADMIN FUNCTIONALITY TESTS PASSED!")
            return True
        else:
            log_error("❌ SOME TESTS FAILED - CHECK ERRORS ABOVE")
            return False

if __name__ == "__main__":
    tester = AdminTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)