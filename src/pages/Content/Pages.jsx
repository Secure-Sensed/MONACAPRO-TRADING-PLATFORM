import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ContentLayout = ({ title, content }) => (
  <div style={{ background: '#0b1120', minHeight: '100vh', color: '#fff' }}>
    <Navbar />
    <div style={{ maxWidth: '800px', margin: '140px auto 100px', padding: '0 20px', lineHeight: '1.8' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '24px', fontWeight: '800' }}>{title}</h1>
      <div style={{ color: '#a0a8b1', fontSize: '18px' }} dangerouslySetInnerHTML={{ __html: content }} />
    </div>
    <Footer />
  </div>
);

export const CompanyPage = () => <ContentLayout title="About Moncaplus Trading" content="<p>Moncaplus Trading was founded with a singular mission: to democratize access to institutional-grade trading tools and insights. Our global team of financial experts and technologists work around the clock to ensure maximum reliability, incredibly tight spreads, and unparalleled order execution.</p><p><br/>With licenses across multiple jurisdictions, we prioritize security and transparency above all else, keeping client funds segregated in tier-1 banks.</p>" />;

export const StocksPage = () => <ContentLayout title="Stock Trading" content="<p>Access global equities markets with zero commission on over 3,000 top US, European, and Asian stocks. Buy fractional shares, earn dividends, and utilize our advanced margin system to maximize your market exposure.</p><p><br/>Trade pre-market and after-hours to stay ahead of the curve, utilizing our lightning-fast execution engines to lock in prices precisely when you need them.</p>" />;

export const MirrorTradingPage = () => <ContentLayout title="Mirror Trading" content="<p>Our award-winning Mirror Trading ecosystem allows you to automatically duplicate the trades of our top-performing algorithmic and human traders. Browse by ROI, risk score, and historical drawdown.</p><p><br/>Join thousands of passive investors who let the experts do the heavy lifting. You maintain 100% control of your funds and can stop mirroring at any time instantly.</p>" />;

export const SoftwarePage = () => <ContentLayout title="Trading Software" content="<p>Download our flagship Moncaplus Pro Terminal for Windows and macOS, featuring 120+ technical indicators, automated trading scripts (MQL/Python compatible), and one-click execution from charts.</p><p><br/>Prefer mobile? The Moncaplus App gives you full control of your portfolio on iOS and Android with push notifications for price alerts and executed orders.</p>" />;

export const InsightPage = () => <ContentLayout title="Market Insights" content="<p>Stay informed with our daily technical and fundamental analysis. Our analysts break down the impact of macroeconomic data, central bank announcements, and geopolitical events on FX, Crypto, and Equity markets.</p><p><br/>Check out our weekly webinars and educational academy to sharp your trading strategies.</p>" />
