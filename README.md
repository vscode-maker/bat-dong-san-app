# Bất Động Sản App

Next.js real estate application with AppSheet API integration.

## Features

- 🏠 Property listings (mua bán & cho thuê)
- 📰 News & articles
- 🏗️ Project showcase
- ⭐ Favorites system
- 🔍 Advanced search & filtering
- 📱 Mobile responsive design
- 🎨 Dark mode support

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **UI:** Tailwind CSS + shadcn/ui
- **Backend:** AppSheet API
- **Deployment:** Vercel

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_APPSHEET_APP_ID=your_app_id
NEXT_PUBLIC_APPSHEET_ACCESS_KEY=your_access_key
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deployment

This project is configured for automatic deployment on Vercel:

- Push to `main` → Auto deploy to Production
- Push to other branches → Auto deploy to Preview

## License

MIT
