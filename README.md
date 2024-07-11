# Study Vault

Study Vault is a collaborative college resource sharing platform. Students can upload class notes, past exams, and study materials, while other students can browse, search, vote on, and comment on resources to identify high-quality content.

## Project Structure

This project is organized as a monorepo::
```
vault/
├── vault-backend/    # Express API backend with MongoDB & Cloudinary
└── vault_frontend/   # React + Vite + Tailwind CSS v4 SPA frontend
```

---

## Getting Started

### Prerequisites
- Node.js (version 22.11.0 or newer recommended)
- MongoDB database (local instance or MongoDB Atlas cluster URI)
- Cloudinary account for media uploads

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd vault-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   Create a `.env` file in the `vault-backend/` directory with the following variables:
   ```env
   DB_ADDRESS=your-mongodb-connection-string
   PORT=5000
   JWT_SECRET=your-jwt-secret-key
   SALT=12
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd vault_frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   Create a `.env` file in the `vault_frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## Deployment Notes

- **Frontend SPA**: The frontend is set up for hosting on Vercel. 
  - To deploy via CLI, run `npx vercel deploy --prod` inside the `vault_frontend` directory.
  - To connect the GitHub repository directly to Vercel, navigate to Vercel settings and configure the **Root Directory** to `vault_frontend`.
- **Backend API**: The backend is ready to be hosted on platforms like Render, Railway, or Vercel Serverless.
