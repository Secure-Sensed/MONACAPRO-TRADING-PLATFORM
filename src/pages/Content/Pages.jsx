import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import FinancialNewsFeed from '../../components/News/FinancialNewsFeed';
import { motion } from 'framer-motion';

const ContentLayout = ({ title, bannerClass, children }) => (
  <div style={{ background: '#0b1120', minHeight: '100vh', color: '#fff' }}>
    <Navbar />
    
    <div style={{
      padding: '120px 40px 60px 40px',
      background: 'linear-gradient(135deg, #0f1c34 0%, #060c18 100%)',
      borderBottom: '1px solid #1a2744'
    }}>
       <div className="container" style={{maxWidth: '1200px', margin: '0 auto'}}>
         <motion.h1 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           style={{ fontSize: '48px', fontWeight: 800 }}
         >
           {title}
         </motion.h1>
       </div>
    </div>

    <div className="container" style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </div>

    <Footer />
  </div>
);

export const CompanyPage = () => (
  <ContentLayout title="Company Overview">
     <div style={{ marginBottom: '60px' }}>
       <h2 style={{fontSize: '24px', marginBottom: '16px'}}>About Moncaplus Trading</h2>
       <p style={{color: '#a0a8b1', fontSize: '18px', lineHeight: 1.6, maxWidth: '800px'}}>
         Established to level the playing field for retail and institutional traders globally, Moncaplus Trading provides top-tier liquidity, zero-latency execution, and institutional grade charting software.
       </p>
     </div>
     <FinancialNewsFeed category="company" title="Corporate Announcements" />
  </ContentLayout>
);

export const StocksPage = () => (
  <ContentLayout title="Equities & Stocks">
     <FinancialNewsFeed category="stocks" title="Global Equity Markets Live" />
  </ContentLayout>
);

export const MirrorTradingPage = () => (
  <ContentLayout title="Mirror Trading Terminal">
     <FinancialNewsFeed category="mirror" title="Algorithmic Strategy Updates" />
  </ContentLayout>
);

export const SoftwarePage = () => (
  <ContentLayout title="Trading Software">
     <div style={{ textAlign: 'center', margin: '40px 0' }}>
       <h2 style={{fontSize: '32px', marginBottom: '20px'}}>Trade on any device. Anywhere.</h2>
       <img src="https://moncapluscopytrading.com/assets/exclusive-funded-banner-graphic.svg" alt="Platforms" style={{maxWidth: '600px', width: '100%'}} />
     </div>
     <FinancialNewsFeed category="crypto" title="Cryptocurrency Platform Feeds" />
  </ContentLayout>
);

export const InsightPage = () => (
  <ContentLayout title="Market Insights & Research">
     <FinancialNewsFeed category="insight" title="Daily Fundamental Analysis" />
  </ContentLayout>
);
