# Medium Clone – Capstone Project

A full-featured publishing platform inspired by Medium, built with Next.js 14, React, TypeScript, MongoDB, and Tailwind CSS.

## Features

- **Authentication** – Email/password signup, login, and protected routes
- **Rich Text Editor** – Markdown editor with live preview
- **Post Management** – Drafts, publishing, cover images, and SEO-ready slugs
- **Tags & Search** – Full-text search and tag filtering
- **Community** – Comments, likes, follows, and author profiles
- **Responsive & SEO Friendly** – Optimized for devices and sharing

## Tech Stack

- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Database: MongoDB with Mongoose
- Auth: JWT tokens
- Data Fetching: TanStack Query
- Styling: Tailwind CSS
- Testing: Jest + React Testing Library

## Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB connection string (Atlas works great)

## Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Create `.env.local`:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your-secret-key-change-in-production
   ```

3. **Run the dev server**

   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app
│   ├── (auth)/
│   ├── (main)/
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── hooks/
├── lib/
├── models/
├── public/
├── src/app/api/
├── types/
└── __tests__/
```

## Testing

```bash
npm test          # Run tests once
npm run test:watch
```

## Build & Deploy

```bash
npm run type-check
npm run build
npm start         # Production server
```

Deployed example: [phase-two-capstone-project.vercel.app](https://phase-two-capstone-project.vercel.app)

## Feature Highlights

### Rich Text Editor
- Markdown with syntax highlighting
- Live preview and media embeds

### Posts
- Create, edit, delete, and save drafts
- Publish with tags, cover images, and excerpts

### Social
- Like, comment, and follow authors
- Personalized feeds and profiles

### Discovery
- Full-text search
- Tag-based exploration

## Screenshot

![alt text](<capstone/public/Screenshot 2025-11-18 170314.png>)

## Deployed Link

[phase-two-capstone-project.vercel.app](https://phase-two-capstone-project.vercel.app)
