# Real Estate Frontend

A modern real-estate property listing platform built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

* Property listing and discovery
* Property search
* Property filters
* Price sorting
* Property details
* User profiles
* Create and manage properties
* Favorites
* Responsive design
* Modern reusable UI components
* API integration with a separate backend
* AI property assistant integration ready

## Tech Stack

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **React Query**
* **Axios**
* **Lucide React**
* **Framer Motion**

## Project Structure

```text
src/
├── app/
├── components/
├── hooks/
├── lib/
├── services/
└── types/
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/real-estate-frontend.git
cd real-estate-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Update the API URL according to your backend environment.

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production Build

```bash
npm run build
npm start
```

## Backend

This frontend communicates with a separate backend API for:

* Authentication
* Properties
* Favorites
* User profiles
* Property management
* AI functionality

## Environment Variables

| Variable              | Description          |
| --------------------- | -------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

## Deployment

The application can be deployed using platforms such as Vercel.

Make sure the production environment contains the correct backend API URL.

## License

This project is for development and demonstration purposes.
