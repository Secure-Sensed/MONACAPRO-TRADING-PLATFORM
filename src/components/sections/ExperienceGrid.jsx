import React from 'react';
import './ExperienceGrid.css';

const ExperienceGrid = () => {
  return (
    <section className="experience-grid">
      <div className="container eg-container">
        
        <div className="eg-column-left">
          <p className="eg-text">
            At moncaplustrading, we provide an exceptional trading experience that empowers you to navigate the exciting world of cryptocurrencies with confidence and ease. By choosing to trade with us, you gain access to a secure, user-friendly platform designed to meet the needs of both beginners and experienced traders. Our advanced trading tools, including real-time charts, market analysis, and customizable features, ensure you stay ahead of market trends. We offer competitive fees, high liquidity, and fast execution, allowing you to maximize your trading potential. Additionally, our commitment to security means your assets are protected with state-of-the-art encryption and safeguards. With 24/7 support and a global network of users, we ensure you have the resources and assistance needed to thrive in the crypto space. Trade with us and take advantage of low barriers to entry, a diverse range of cryptocurrencies, and a trusted platform that prioritizes your success.
          </p>
        </div>

        <div className="eg-column-middle">
          {/* Specific user stats illustration from screenshots */}
          <img src="https://moncapluscopytrading.com/assets/users.webp" alt="Trader App Stats" onError={(e) => { e.target.src = 'https://moncapluscopytrading.com/assets/Group_2648.png'; }} />
        </div>

        <div className="eg-column-right">
          <div className="eg-card eg-card-darkgreen">
            <h3>Global Market with Liquidity</h3>
            <p>
              With a global user base, crypto markets provide high liquidity, meaning you can execute large trades without significantly impacting the price. This liquidity ensures that you can enter and exit trades efficiently, no matter the size of your position. Whether you're trading in major cryptocurrencies or niche altcoins, liquidity is a key advantage, allowing for smoother transactions and less slippage.
            </p>
          </div>
          
          <div className="eg-card eg-card-lightgreen">
            <h3>Low Barriers to Entry</h3>
            <p>
              Getting started in crypto trading is easier than ever, with low barriers to entry. Many exchanges allow you to begin trading with minimal capital, so even new traders can start with as little as a few dollars. Additionally, you can buy fractional amounts of cryptocurrencies, meaning you don't need to purchase an entire coin. This makes the crypto market highly accessible to people from all walks of life, allowing anyone with an internet connection to participate and grow their portfolio.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ExperienceGrid;
