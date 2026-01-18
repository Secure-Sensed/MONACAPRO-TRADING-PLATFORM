import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from '../hooks/use-toast';
import { Shield } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Login with username (convert to email)
      const email = `${formData.username}@monacaptradingpro.com`;
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: email,
        password: formData.password
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        // Store token
        localStorage.setItem('session_token', response.data.token);
        
        // Set axios default header for subsequent requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        // Verify admin role
        if (response.data.user.role === 'admin') {
          toast({
            title: 'Admin Login Successful',
            description: `Welcome ${response.data.user.full_name}!`
          });
          
          // Force reload to ensure AuthContext picks up the session
          window.location.href = '/admin';
        } else {
          toast({
            title: 'Access Denied',
            description: 'Admin privileges required',
            variant: 'destructive'
          });
        }
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        title: 'Login Failed',
        description: error.response?.data?.detail || 'Invalid admin credentials',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1f3a] to-[#0a1628] flex items-center justify-center px-4 py-20">
      <Card className="w-full max-w-md bg-[#1a2942]/80 backdrop-blur-sm border-gray-700">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-cyan-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-white text-center">
            Admin Access
          </CardTitle>
          <CardDescription className="text-gray-400 text-center">
            Login to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">Admin Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter admin username"
                value={formData.username}
                onChange={handleChange}
                required
                className="bg-[#0a1628] border-gray-600 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Admin Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter admin password"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-[#0a1628] border-gray-600 text-white placeholder:text-gray-500"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white transition-all"
            >
              {isLoading ? 'Logging in...' : 'Login as Admin'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-cyan-400/10 border border-cyan-400/30 rounded-lg">
            <p className="text-cyan-400 text-sm font-semibold mb-2">Admin Credentials:</p>
            <div className="space-y-1">
              <p className="text-gray-400 text-xs">Username: admin | Password: admin0123</p>
              <p className="text-gray-400 text-xs">Username: addmin | Password: admin0123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;