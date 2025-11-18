# Medium Clone - Capstone Project

A full-featured publishing platform inspired by Medium, built with Next.js 14, React, TypeScript, and MongoDB.

##  Features

-  **Authentication**: Signup, login, and protected routes
-  **Rich Text Editor**: Markdown-based editor with preview
-  **Posts Management**: Full CRUD operations with drafts and publishing
-  **Tags System**: Organize posts with tags
-  **Search**: Full-text search across posts
-  **Comments**: Comment on posts
-  **Likes/Claps**: Like posts
-  **Follow System**: Follow authors and see their posts
-  **Responsive Design**: Works on all devices
-  **SEO Optimized**: Meta tags and Open Graph support
-  **Performance**: Optimized with React Query and Next.js caching

##  Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Backend**: MongoDB + Mongoose
- **Authentication**: JWT tokens
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library
- **Markdown**: react-markdown with syntax highlighting

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB database (MongoDB Atlas free tier works)

##  Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up MongoDB

1. Create a cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user and whitelist your IP
3. Get your connection string from "Connect" > "Connect your application"

### 3. Configure Environment Variables

Create `.env.local`:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your-secret-key-change-in-production
```

### 4. Set Up Database

The database schema is automatically created using Mongoose models when you first run the application.

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

##  Project Structure

```
├── app/                      
│   ├── (auth)/              
│   │   ├── login/
│   │   └── signup/
│   ├── (main)/             
│   │   ├── posts/[slug]/   
│   │   ├── profile/[id]/    
│   │   ├── tags/[slug]/ 
│   │   ├── search/          
│   │   └── write/           
│   ├── layout.tsx           
│   └── page.tsx            
├── components/
│   ├── editor/              
│   ├── layout/              
│   ├── post/                
│   ├── ui/                  
│   └── user/                
├── hooks/                   
├── lib/
│   ├── supabase/           
│   └── utils.ts            
├── types/       
├── supabase/
│   └── schema.sql          
└── __tests__/              
```

##  Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch
```

##  Build

```bash
# Type check
npm run type-check

# Build for production
npm run build

# Start production server
npm start
```

##  Deployment


### Rich Text Editor
- Markdown-based editor
- Live preview
- Syntax highlighting for code blocks
- Support for images, links, lists, etc.

### Posts
- Create, edit, delete posts
- Save as drafts
- Publish with timestamps
- SEO-friendly slugs
- Cover images

### Social Features
- Like posts
- Comment on posts
- Follow authors
- View author profiles

### Search & Discovery
- Full-text search
- Tag filtering
- Home feed with latest posts
### Screenshort




