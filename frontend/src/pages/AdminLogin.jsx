import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from '../hooks/use-toast';
import { Shield } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // MOCKED: Admin credentials (will be replaced with backend)
    if (formData.email === 'admin@moncaplus.com' && formData.password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      toast({
        title: 'Admin Login Successful',
        description: 'Welcome to the admin panel'
      });
      navigate('/admin');
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid admin credentials',
        variant: 'destructive'
      });
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
              <Label htmlFor="email" className="text-gray-300">Admin Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter admin email"
                value={formData.email}
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
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white transition-all"
            >
              Login as Admin
            </Button>
          </form>

          <div className="mt-6 p-4 bg-cyan-400/10 border border-cyan-400/30 rounded-lg">
            <p className="text-cyan-400 text-sm font-semibold mb-2">Demo Credentials:</p>
            <p className="text-gray-400 text-xs">Email: admin@moncaplus.com</p>
            <p className="text-gray-400 text-xs">Password: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;