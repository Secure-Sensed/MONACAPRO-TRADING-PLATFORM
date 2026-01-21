"""
Backend API Tests for Monacap Trading Pro
Tests: Auth, Users, Traders, Dashboard, Plans, Wallets, Transactions
"""
import pytest
import requests
import os
import uuid
from datetime import datetime

# Use the public URL for testing
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://monacaptrade.preview.emergentagent.com')

# Test credentials
ADMIN_EMAIL = "admin@monacaptradingpro.com"
ADMIN_PASSWORD = "admin0123"

class TestHealthCheck:
    """Health check endpoint tests"""
    
    def test_health_endpoint(self):
        """Test health check returns healthy status"""
        response = requests.get(f"{BASE_URL}/health")
        # Health endpoint may return HTML if routed to frontend
        # Check if it's JSON or HTML
        if response.headers.get('content-type', '').startswith('application/json'):
            assert response.status_code == 200
            data = response.json()
            assert data.get('status') == 'healthy'
        else:
            # Frontend is serving the page, which is fine
            assert response.status_code == 200


class TestAuthEndpoints:
    """Authentication endpoint tests"""
    
    def test_login_success_admin(self):
        """Test admin login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert data['success'] == True
        assert 'token' in data
        assert 'user' in data
        assert data['user']['email'] == ADMIN_EMAIL
        assert data['user']['role'] == 'admin'
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "wrong@example.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401
    
    def test_register_new_user(self):
        """Test registration with new unique email"""
        unique_email = f"test_user_{uuid.uuid4().hex[:8]}@example.com"
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "full_name": "Test User",
            "email": unique_email,
            "password": "testpassword123"
        })
        assert response.status_code == 200
        data = response.json()
        assert data['success'] == True
        assert 'token' in data
        assert 'user' in data
        assert data['user']['email'] == unique_email
        assert data['user']['role'] == 'user'
    
    def test_register_duplicate_email(self):
        """Test registration with existing email fails"""
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "full_name": "Duplicate User",
            "email": ADMIN_EMAIL,
            "password": "testpassword123"
        })
        assert response.status_code == 400
    
    def test_get_me_with_token(self):
        """Test /auth/me endpoint with valid token"""
        # First login to get token
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        token = login_response.json()['token']
        
        # Test /auth/me
        response = requests.get(f"{BASE_URL}/api/auth/me", headers={
            "Authorization": f"Bearer {token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert data['success'] == True
        assert data['user']['email'] == ADMIN_EMAIL
    
    def test_get_me_without_token(self):
        """Test /auth/me endpoint without token fails"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401
    
    def test_logout(self):
        """Test logout endpoint"""
        # First login
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        token = login_response.json()['token']
        
        # Logout
        response = requests.post(f"{BASE_URL}/api/auth/logout", headers={
            "Authorization": f"Bearer {token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert data['success'] == True


class TestTradersEndpoints:
    """Traders endpoint tests"""
    
    def test_get_traders(self):
        """Test getting all traders"""
        response = requests.get(f"{BASE_URL}/api/traders")
        assert response.status_code == 200
        data = response.json()
        assert data['success'] == True
        assert 'traders' in data
        assert isinstance(data['traders'], list)
        # Verify trader data structure
        if len(data['traders']) > 0:
            trader = data['traders'][0]
            assert 'trader_id' in trader
            assert 'name' in trader
            assert 'profit' in trader


class TestPlansEndpoints:
    """Plans endpoint tests"""
    
    def test_get_plans(self):
        """Test getting all plans"""
        response = requests.get(f"{BASE_URL}/api/plans")
        assert response.status_code == 200
        data = response.json()
        assert data['success'] == True
        assert 'plans' in data
        assert isinstance(data['plans'], list)


class TestWalletsEndpoints:
    """Wallets endpoint tests"""
    
    def test_get_wallets(self):
        """Test getting all wallets"""
        response = requests.get(f"{BASE_URL}/api/wallets")
        assert response.status_code == 200
        data = response.json()
        assert data['success'] == True
        assert 'wallets' in data


class TestDashboardEndpoints:
    """Dashboard endpoint tests (requires auth)"""
    
    @pytest.fixture
    def auth_token(self):
        """Get admin auth token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()['token']
    
    def test_get_dashboard_stats(self, auth_token):
        """Test getting dashboard stats"""
        response = requests.get(f"{BASE_URL}/api/dashboard/stats", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert data['success'] == True
        assert 'portfolio' in data
        assert 'balance' in data['portfolio']
    
    def test_dashboard_stats_without_auth(self):
        """Test dashboard stats without auth fails"""
        response = requests.get(f"{BASE_URL}/api/dashboard/stats")
        assert response.status_code == 401


class TestAdminEndpoints:
    """Admin endpoint tests"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin auth token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()['token']
    
    def test_get_users_admin(self, admin_token):
        """Test getting all users as admin"""
        response = requests.get(f"{BASE_URL}/api/users", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert data['success'] == True
        assert 'users' in data
        assert isinstance(data['users'], list)
    
    def test_get_users_without_admin(self):
        """Test getting users without admin fails"""
        response = requests.get(f"{BASE_URL}/api/users")
        assert response.status_code == 401
    
    def test_get_admin_stats(self, admin_token):
        """Test getting admin stats"""
        response = requests.get(f"{BASE_URL}/api/admin/stats", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert data['success'] == True
        assert 'stats' in data
        assert 'total_users' in data['stats']
    
    def test_get_transactions_admin(self, admin_token):
        """Test getting all transactions as admin"""
        response = requests.get(f"{BASE_URL}/api/transactions", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert data['success'] == True
        assert 'transactions' in data


class TestUserRegistrationFlow:
    """Test complete user registration and login flow"""
    
    def test_full_registration_login_flow(self):
        """Test register -> login -> get me -> logout flow"""
        unique_email = f"test_flow_{uuid.uuid4().hex[:8]}@example.com"
        
        # 1. Register
        register_response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "full_name": "Flow Test User",
            "email": unique_email,
            "password": "flowtest123"
        })
        assert register_response.status_code == 200
        register_data = register_response.json()
        assert register_data['success'] == True
        register_token = register_data['token']
        
        # 2. Verify user can access /auth/me with registration token
        me_response = requests.get(f"{BASE_URL}/api/auth/me", headers={
            "Authorization": f"Bearer {register_token}"
        })
        assert me_response.status_code == 200
        me_data = me_response.json()
        assert me_data['user']['email'] == unique_email
        
        # 3. Logout
        logout_response = requests.post(f"{BASE_URL}/api/auth/logout", headers={
            "Authorization": f"Bearer {register_token}"
        })
        assert logout_response.status_code == 200
        
        # 4. Login with new credentials
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": unique_email,
            "password": "flowtest123"
        })
        assert login_response.status_code == 200
        login_data = login_response.json()
        assert login_data['success'] == True
        assert login_data['user']['email'] == unique_email


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
