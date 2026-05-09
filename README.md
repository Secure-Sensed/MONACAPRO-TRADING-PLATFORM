# MonaCap Pro Trading Platform

A modern, full-stack trading platform built with React, Supabase, and Tailwind CSS. Optimized for Vercel deployment.

## 🚀 Features

- **Real-time Trading Charts** - Interactive charts with live market data
- **Copy Trading** - Mirror successful traders' strategies
- **Multi-Asset Support** - Forex, Crypto, Stocks, Indices, Commodities
- **Secure Authentication** - Supabase Auth with email/password
- **Admin-managed Funding** - Admin-controlled deposit accounts and transaction approval workflow
- **Realtime Account Updates** - Supabase Realtime subscriptions for balances, transactions, and funding methods
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Multi-language Support** - i18next integration
- **Admin Dashboard** - Comprehensive admin panel

## 🛠️ Tech Stack

- **Frontend:** React 18, React Router, Tailwind CSS
- **Backend:** Supabase (Auth, Database, Storage)
- **Charts:** Recharts
- **UI Components:** Radix UI, Lucide Icons
- **Build Tool:** CRACO (Create React App Config Override)
- **Deployment:** Vercel

## 📁 Project Structure

```
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── context/        # React contexts
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilities and configurations
│   ├── utils/          # Helper functions
│   └── i18n/           # Internationalization
├── supabase/           # Database schema and migrations
└── vercel.json         # Vercel deployment config
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 8.x or higher

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Secure-Sensed/MONACAPRO-TRADING-PLATFORM.git
cd MONACAPRO-TRADING-PLATFORM
```

2. **Install dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Set up environment variables**

Copy `.env.example` to `.env.local` and fill in your values:
```bash
cp .env.example .env.local
```

Required environment variables:
- `REACT_APP_SUPABASE_URL` - Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `REACT_APP_FMP_API_KEY` - Financial Modeling Prep API key (optional)

Run `supabase/schema.sql` for a fresh Supabase project, or `supabase/migrations.sql` for an existing project. Deposit accounts are managed from `Admin Dashboard -> Deposit Accounts`.

4. **Start development server**
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
npm run build
```

## 🌐 Deployment

This project is optimized for Vercel deployment.

### Automatic Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### Manual Deployment

```bash
npm run build
# Deploy the build/ folder to your hosting provider
```

## 🔧 Configuration

### CRACO Configuration

The project uses CRACO for advanced webpack configuration:
- Custom aliases (`@` for `src/`)
- Additional webpack plugins
- Custom build optimizations

### Tailwind CSS

Custom Tailwind configuration with:
- Custom color palette
- Extended spacing and typography
- Animation utilities

## 📱 Supported Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For support, please contact the development team.

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
