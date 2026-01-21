import "./App.css";
import "./i18n";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import AuthCallback from "./components/AuthCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Stocks from "./pages/Stocks";
import MirrorTrading from "./pages/MirrorTrading";
import Company from "./pages/Company";
import Partnership from "./pages/Partnership";
import Contact from "./pages/Contact";
import Software from "./pages/Software";
import Insight from "./pages/Insight";
import { Toaster } from "./components/ui/toaster";

function AppRouter() {
  const location = useLocation();
  
  // Check for session_id in URL hash for auth callback
  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }
  
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <Admin />
            </ProtectedRoute>
          } 
        />
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/mirror-trading" element={<MirrorTrading />} />
        <Route path="/company" element={<Company />} />
        <Route path="/partnership" element={<Partnership />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/software" element={<Software />} />
        <Route path="/insight" element={<Insight />} />
      </Routes>
      <Footer />
      <ChatWidget />
      <Toaster />
    </>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
