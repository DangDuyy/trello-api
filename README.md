# 🚀 MERN Trello Web Application

A Kanban-style task management application inspired by Trello, built using the MERN Stack (MongoDB, Express.js, React.js, Node.js).

## 📋 Table of Contents

* [Technologies Used](#technologies-used)
* [Key Features](#key-features)
* [Project Structure](#project-structure)
* [System Requirements](#system-requirements)
* [Installation & Getting Started](#installation--getting-started)
* [API Documentation](#api-documentation)
* [Screenshots](#screenshots)
* [Contributing](#contributing)
* [License](#license)

## 🛠️ Technologies Used

### Backend (API Server)

* **Node.js** (>=18.x) - Runtime environment
* **Express.js** - Web framework
* **MongoDB** - NoSQL database
* **Socket.io** - Real-time communication
* **JWT (jsonwebtoken)** - Authentication & Authorization tokens
* **Bcrypt.js** - Password hashing and security
* **Joi** - Data and schema validation
* **Multer** - Middleware for file uploads
* **Cloudinary** - Cloud-based image storage
* **Streamifier** - File stream handling for uploads
* **Brevo (SendinBlue)** - Email service provider
* **Resend** - Alternative email service
* **CORS** - Cross-origin resource sharing
* **Cookie Parser** - Middleware for cookie parsing
* **HTTP Status Codes** - Standardized HTTP responses
* **Lodash** - JavaScript utility library
* **MS** - Time conversion utility
* **UUID** - Unique ID generation
* **Async Exit Hook** - Graceful app shutdown
* **Babel** - Transpiler and module resolver
* **ESLint** - Code linting and formatting
* **Nodemon** - Auto-restart during development
* **Rimraf** - Cross-platform file deletion
* **Cross-env** - Environment variable compatibility

### Frontend (Web Client)

* **React.js** (^18.2.0) - UI framework
* **Vite** - Fast build tool and dev server
* **Material-UI (MUI)** - Component library

  * MUI Icons - 2000+ Material Design icons
  * MUI Lab - Experimental components
  * Emotion - CSS-in-JS styling
* **Redux Toolkit** - Modern state management
* **React Redux** - Official React bindings for Redux
* **Redux Persist** - Persist Redux state to localStorage
* **React Router DOM** - Routing and navigation
* **React Hook Form** - Performant form handling and validation
* **Socket.io Client** - Real-time communication
* **Axios** - HTTP client with interceptors
* **React Toastify** - Elegant notifications
* **DND Kit** - Modern drag-and-drop toolkit

  * @dnd-kit/core, sortable, utilities
* **Material UI Confirm** - Confirmation dialogs
* **@uiw/react-md-editor** - Markdown editor
* **Moment.js** - Date manipulation
* **Lodash** - Utility functions
* **Randomcolor** - Generate random colors
* **Rehype Sanitize** - Sanitize markdown HTML
* **Yarn** - Package manager
* **Cross-env** - Cross-platform environment variables
* **TypeScript ESLint** - TypeScript linting
* **Vite Plugin React SWC** - Fast refresh for React
* **Vite Plugin SVGR** - SVG handling
* **ESLint Plugins** - React, hooks, imports, etc.

## ✨ Key Features

### 🔐 Authentication & Authorization

* Email verification during registration
* Login / Logout functionality
* User profile management
* Password change
* Board role management (Owner, Member)

### 📊 Board Management

* Create, edit, delete boards
* Set board privacy (public/private)
* Invite members to boards
* Manage member list

### 📝 Column & Card Management

* Create, edit, delete columns
* Create, edit, delete cards
* Drag & drop cards between columns
* Sort columns and cards
* Upload card cover images
* Add detailed descriptions to cards

### 🔄 Real-time Features

* Real-time updates on changes
* Board invitation notifications
* Sync data across multiple clients

### 🎨 User Interface

* Fully responsive design
* Dark/Light theme toggle
* Material Design components
* Smooth animations
* User-friendly experience

## 📁 Project Structure

```
MERN_TRELLO_APP/
├── trello-api/                 # Backend API Server
│   ├── src/
│   │   ├── config/            # DB, CORS, etc. configs
│   │   ├── controllers/       # API controllers
│   │   │   ├── boardController.js
│   │   │   ├── cardController.js
│   │   │   ├── columnController.js
│   │   │   ├── userController.js
│   │   │   └── invitationController.js
│   │   ├── middlewares/       # Middleware functions
│   │   ├── models/            # MongoDB models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── sockets/           # Socket.io handlers
│   │   ├── utils/             # Utility functions
│   │   └── server.js          # Entry point
│   ├── package.json
│   └── README.md
│
├── vite-trello-web-base-project/   # Frontend Web Client
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   │   ├── Auth/         # Auth pages
│   │   │   ├── Boards/       # Boards overview
│   │   │   ├── Settings/     # User settings
│   │   │   └── User/         # User profile
│   │   ├── redux/            # Redux store & slices
│   │   ├── utils/            # Utility functions
│   │   ├── theme.js          # MUI theme config
│   │   ├── App.jsx           # Main App component
│   │   └── main.jsx          # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── README.md                   # Main documentation
```

## 💻 System Requirements

* **Node.js**: >= 18.x
* **npm** or **yarn**: Latest version
* **MongoDB**: Local or MongoDB Atlas
* **Git**: For cloning the repository

## 🚀 Installation & Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/DangDuyy/MERN_TRELLO_APP.git
cd MERN_TRELLO_APP
```

### 2. Setup Backend

```bash
cd trello-api
npm install
```

Create a `.env` file in `trello-api` folder:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/trello-app
# or use MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Server
PORT=8017
BUILD_MODE=dev

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Email Service
BREVO_API_KEY=your-brevo-api-key
# or
RESEND_API_KEY=your-resend-api-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Client URL
CLIENT_URL=http://localhost:5173
```

Run backend server:

```bash
npm run dev
```

Backend will run at `http://localhost:8017`

### 3. Setup Frontend

Open a new terminal:

```bash
cd vite-trello-web-base-project
npm install
```

Create a `.env` file in `vite-trello-web-base-project` folder:

```env
VITE_API_ROOT=http://localhost:8017
```

Run frontend server:

```bash
npm run dev
```

Frontend will run at: `http://localhost:5173`

### 4. Open Application

Visit: `http://localhost:5173` in your browser

## 📖 API Documentation

### Authentication

* `POST /v1/auth/register` - Register new account
* `POST /v1/auth/login` - Login
* `DELETE /v1/auth/logout` - Logout
* `PUT /v1/auth/refresh_token` - Refresh token

### User

* `GET /v1/users/profile` - Get profile info
* `PUT /v1/users/update` - Update profile
* `PUT /v1/users/change-password` - Change password

### Board

* `GET /v1/boards` - List boards
* `POST /v1/boards` - Create new board
* `GET /v1/boards/:id` - Get board detail
* `PUT /v1/boards/:id` - Update board
* `DELETE /v1/boards/:id` - Delete board

### Column

* `POST /v1/columns` - Create new column
* `PUT /v1/columns/:id` - Update column
* `DELETE /v1/columns/:id` - Delete column

### Card

* `POST /v1/cards` - Create new card
* `PUT /v1/cards/:id` - Update card
* `DELETE /v1/cards/:id` - Delete card

## 🎯 How to Use

### Step 1: Register Account

1. Go to the register page
2. Fill in email, password, full name
3. Verify your email via confirmation link
4. Login with your account

### Step 2: Create Board

1. Click "Create New Board"
2. Enter board name and description
3. Select public/private mode
4. Click "Create Board"

### Step 3: Manage Columns and Cards

1. Add columns using "Add Column"
2. Add cards to columns
3. Drag & drop cards between columns
4. Edit card content as needed

### Step 4: Invite Members

1. Click "Invite Members" icon
2. Enter the email address of the invitee
3. They will receive an invitation email
4. Once accepted, they can access the board

## 🔧 Available Scripts

### Backend (`trello-api`)

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run production   # Run production server
npm run lint         # Run linter
```

### Frontend (`vite-trello-web-base-project`)

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
```

## 🐛 Troubleshooting

### Common Errors:

1. **Port already in use**

   ```bash
   Error: listen EADDRINUSE: address already in use :::8017
   ```

   Solution: Change the port in `.env` or kill the running process

2. **MongoDB connection error**

   ```bash
   MongoNetworkError: failed to connect to server
   ```

   Solution: Make sure MongoDB is running and the URI is correct

3. **CORS Error**

   ```bash
   Access to XMLHttpRequest blocked by CORS policy
   ```

   Solution: Check CORS configuration in backend

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

* **Repository**: [https://github.com/DangDuyy/MERN\_TRELLO\_APP](https://github.com/DangDuyy/MERN_TRELLO_APP)
