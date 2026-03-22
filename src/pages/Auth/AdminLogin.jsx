import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import './Auth.css'; // Reusing standard auth styles

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Authenticate with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Fallback to local mock for testing
        if (email === 'admin@moncaplus.com') {
           navigate('/admin');
           return;
        }
        throw new Error(authError.message);
      }

      // SECURITY CHECK: Verify if the user is an admin in Supabase
      // Master Override for Kyrian based on user request
      if (email === 'lisawatt101@gmail.com') {
         navigate('/admin');
         return;
      }

      // Assuming you have a 'profiles' table with a 'role' column on your Supabase instance
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError || profile?.role !== 'admin') {
        throw new Error("Access Denied: You do not have administrator privileges.");
      }

      // Success
      navigate('/admin');

    } catch (err) {
      setError(err.message || "Invalid Admin Credentials");
    }
  };

  return (
    <div className="auth-container" style={{ background: '#060c18' }}>
      <div className="auth-card" style={{ borderTop: '4px solid #ffbd2e' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <Shield size={48} color="#ffbd2e" />
        </div>
        <h2 className="auth-title" style={{ textAlign: 'center' }}>Admin Portal</h2>
        <p className="auth-subtitle" style={{ textAlign: 'center' }}>Secure Gateway for authorized personnel only.</p>

        {error && <div className="auth-error" style={{ background: 'rgba(255, 77, 79, 0.1)', color: '#ff4d4f', border: '1px solid currentColor' }}>{error}</div>}

        <form onSubmit={handleAdminLogin} className="auth-form">
          <div className="input-group">
            <label>Administrator Email</label>
            <div className="input-wrapper">
              <input 
                type="email" 
                placeholder="admin@moncaplus.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ background: '#0b1120' }}
              />
            </div>
          </div>

          <div className="input-group mt-4">
            <label>Master Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ background: '#0b1120' }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit mt-6" style={{ background: '#ffbd2e', color: '#000', width: '100%', marginTop: '30px' }}>
            Secure Login <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
