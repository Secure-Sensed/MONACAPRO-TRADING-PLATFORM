import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAppContext } from '../../context/AppContext';
import './Auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { users, setUsers, setCurrentUser } = useAppContext();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    // SECURITY CHECK: Is this the first user?
    // If the database has 0 users, this new user gets the 'admin' role.
    const isFirstUser = users.length === 0;
    const assignedRole = isFirstUser ? 'admin' : 'user';

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        // Fallback to MOCK mode 
        console.warn("Supabase not running. Using Mock Database user registration...");
        const mockUser = { id: Math.random().toString(), name, email, role: assignedRole, balance: 0 };
        setUsers([...users, mockUser]);
        setCurrentUser(mockUser);
        
        if (assignedRole === 'admin') {
          alert("🎉 System Initialized! You are the first user and have been granted Administrator credentials.");
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
        return;
      }

      // Supabase Success! Insert into profile table
      if (data.user) {
         // Create profile row for real DB
         await supabase.from('profiles').insert({
           id: data.user.id,
           full_name: name,
           role: assignedRole
         });
         
         if (assignedRole === 'admin') {
           alert("🎉 System Initialized! You are the first user and have been granted Administrator credentials.");
           navigate('/admin');
         } else {
           navigate('/dashboard');
         }
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <span className="logo-accent">MCT</span> Moncaplus Trading
        </Link>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join thousands of traders globally</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="input-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit">
            Create Account <ArrowRight size={18} />
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
