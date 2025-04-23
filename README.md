# Health Tracker Application - Setup Guide

This guide provides step-by-step instructions on how to set up and run the Health Tracker application on both macOS and Windows systems.

## Prerequisites

### For macOS:
- Node.js (v14.x or higher) - [Download](https://nodejs.org/)
- npm (v6.x or higher, comes with Node.js)
- MongoDB Community Edition - [Download](https://www.mongodb.com/try/download/community)
- Git (optional) - [Download](https://git-scm.com/download/mac)

### For Windows:
- Node.js (v14.x or higher) - [Download](https://nodejs.org/)
- npm (v6.x or higher, comes with Node.js)
- MongoDB Community Edition - [Download](https://www.mongodb.com/try/download/community)
- Git (optional) - [Download](https://git-scm.com/download/win)

## Installation Steps

### Step 1: Clone or download the repository (if not already done)

If you have Git installed:
```bash
git clone [repository-url]
cd fitness-tracker-test
```

Or simply download and extract the ZIP file and navigate to the extracted folder.

### Step 2: Install Server Dependencies

```bash
cd server
npm install
```

### Step 3: Install Client Dependencies

```bash
cd ../client
npm install
```

### Step 4: Set up MongoDB

#### For macOS:
```bash
# Install MongoDB (if not installed)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community
```

#### For Windows:
1. After installing MongoDB, create a directory for the database:
```cmd
md C:\data\db
```

2. Start MongoDB server:
```cmd
"C:\Program Files\MongoDB\Server\{version}\bin\mongod.exe"
```
Replace `{version}` with your installed MongoDB version (e.g., 6.0).

## Running the Application

### Step 1: Start the Server

#### For macOS & Windows:
```bash
# Navigate to the server directory from the project root
cd server

# Run in development mode (with auto-reload)
npm run dev

# OR run in production mode
npm start
```

### Step 2: Start the Client

#### For macOS & Windows:
```bash
# Navigate to the client directory from the project root
cd client

# Start the React application
npm start
```

### Step 3: Access the Application
Open your web browser and navigate to:
- http://localhost:3000 (or another port if 3000 is in use)

## Troubleshooting

### MongoDB Connection Issues:
- Ensure MongoDB is running properly
- Check that the connection string in `server/config/db.js` matches your MongoDB setup

### Port Already in Use:
- If port 3000 is already in use for the client, React will prompt you to use a different port
- If port 5000 is already in use for the server, modify the port in `server/server.js`

### Dependencies Installation Errors:
- Try clearing npm cache: `npm cache clean --force`
- Ensure you have the correct Node.js version

## Stopping the Application

### Step 1: Stop the Client and Server
Press `Ctrl+C` in each respective terminal window.

### Step 2: Stop MongoDB

#### For macOS:
```bash
brew services stop mongodb-community
```

#### For Windows:
Simply close the Command Prompt window running MongoDB, or press `Ctrl+C`.