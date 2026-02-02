import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from '../hooks/use-toast';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
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
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      toast({
        title: 'Login Successful',
        description: 'Welcome back to Monacap Trading Pro!'
      });
      
      // Small delay to let AuthContext update
      setTimeout(() => {
        if (result.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 200);
    } else {
      toast({
        title: 'Login Failed',
        description: result.error || 'Invalid credentials',
        variant: 'destructive'
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1f3a] to-[#0a1628] flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="w-full max-w-md bg-[#1a2942]/80 backdrop-blur-sm border-gray-700 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all">
          <CardHeader className="space-y-1">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CardTitle className="text-3xl font-bold text-white text-center">
                Welcome Back
              </CardTitle>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <CardDescription className="text-gray-400 text-center">
                Login to access your trading account
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-[#0a1628] border-gray-600 text-white placeholder:text-gray-500 focus:border-cyan-400 transition-all"
                />
              </motion.div>
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-[#0a1628] border-gray-600 text-white placeholder:text-gray-500 focus:border-cyan-400 transition-all"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white transition-all shadow-lg shadow-cyan-500/30"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </motion.div>
            </form>

            <motion.p 
              className="text-center text-sm text-gray-400 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              Don't have an account?{' '}
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                Register here
              </Link>
            </motion.p>

            <div className="mt-4 p-3 bg-blue-400/10 border border-blue-400/30 rounded-lg">
              <p className="text-blue-400 text-xs text-center">
                💡 Admin users can login here using their credentials
              </p>
              <p className="text-gray-400 text-xs text-center mt-1">
                (admin@monacaptradingpro.com or addmin@monacaptradingpro.com)
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
