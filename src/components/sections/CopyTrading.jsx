import React from 'react';
import './CopyTrading.css';

const CopyTrading = () => {
  return (
    <section className="copy-trading">
      <div className="container ct-container">
        
        <div className="ct-content">
          <h2 className="ct-title">Copy Trading with moncaplus</h2>
          
          <p className="ct-body">
            Copy trading is an innovative investment strategy that allows you to automatically replicate the trades of experienced and successful traders. Instead of making trading decisions on your own, you can choose a professional trader to follow, and their trades will be mirrored in your account in real-time.
          </p>
          
          <p className="ct-body mt-4">
            This approach is ideal for beginners or those who lack the time to analyze markets, as it enables you to benefit from the expertise of seasoned traders. You maintain full control — choose who to follow, set your investment amount, and stop copying at any time.
          </p>
          
          <p className="ct-body mt-8">
            Copy trading provides transparency, flexibility, and the potential to diversify your portfolio by following multiple strategies. Whether you are new to trading or looking to expand your investment options, copy trading offers a simple and effective way to participate in the markets.
          </p>
        </div>

        <div className="ct-image">
          <video 
            src="https://moncapluscopytrading.com/assets/anim.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            style={{ width: '100%', maxWidth: '500px', height: 'auto' }}
          />
        </div>

      </div>
    </section>
  );
};

export default CopyTrading;
