# TaskFlow - Trello-like Task Management Application

TaskFlow is a full-stack, modern task management application featuring a Kanban-style drag-and-drop board. It is built using the MERN stack (MongoDB, Express, React/Next.js, Node.js).

## Features
- **User Authentication**: Secure JWT-based registration and login.
- **Role-Based Access Control (RBAC)**:
  - **Normal Users**: Can register, create tasks, manage their own tasks, and assign unassigned tasks to themselves.
  - **Admin Users**: Have elevated privileges, can view all users and tasks, manage all assignments, and reassign tasks freely.
- **Drag-and-Drop Board**: Move tasks seamlessly between "To Do", "Doing", and "Done" columns.
- **Modern Glassmorphism UI**: Beautiful, vibrant aesthetics without relying on Tailwind CSS.

## Technology Stack
- **Frontend**: Next.js (App Router), React, `dnd-kit` (drag and drop), Axios, CSS Modules (Vanilla CSS).
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs.

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone the repository
\`\`\`bash
git clone <your-repo-url>
cd <repository-directory>
\`\`\`

### 2. Backend Setup
1. Navigate to the backend directory:
   \`\`\`bash
   cd backend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Create a `.env` file from the example:
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Update `MONGO_URI` if your database is hosted elsewhere.
4. Seed the initial Admin user:
   \`\`\`bash
   npm run seed
   \`\`\`
   *This creates an admin with credentials `admin@example.com` / `admin123`.*
5. Start the backend server:
   \`\`\`bash
   npm run dev
   \`\`\`

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   \`\`\`bash
   cd frontend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. (Optional) Create a `.env` file if your backend is running on a different port:
   \`\`\`bash
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   \`\`\`
4. Start the frontend development server:
   \`\`\`bash
   npm run dev
   \`\`\`
5. Open your browser and visit `http://localhost:3000`.

## Deployment Information
Both frontend and backend are ready to be deployed to modern cloud providers.

### Deploying the Backend (e.g., Render / Railway / Heroku)
1. Push the `backend` folder as its own service.
2. Set the Environment Variables (`MONGO_URI`, `JWT_SECRET`, `PORT`) in the hosting provider's dashboard.
3. Define the start command as `npm start`.

### Deploying the Frontend (e.g., Vercel / Netlify)
1. Import the `frontend` directory as a new project in Vercel.
2. Set the `NEXT_PUBLIC_API_URL` environment variable to point to your deployed backend URL.
3. Deploy!

## Screenshots
*(Add screenshots of the Dashboard, Login page, and Task Creation Modal here)*
