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

## Git and GitHub Workflow Guide

This section provides instructions on how to use Git and GitHub for collaboration on the Health Tracker project.

### Setting Up Git

1. **Configure Git** (if not already configured):
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

2. **Connect to GitHub** (recommended to use SSH):
   ```bash
   # Generate SSH key
   ssh-keygen -t ed25519 -C "your.email@example.com"
   
   # Start ssh-agent and add key
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```
   
   Then add the SSH key to your GitHub account (copy the contents of `~/.ssh/id_ed25519.pub`).

### Basic Git Commands

1. **Check Status**:
   ```bash
   git status
   ```

2. **Creating and Switching Branches**:
   ```bash
   # Create and switch to a new branch
   git checkout -b feature/new-feature
   
   # Switch to an existing branch
   git checkout main
   ```

3. **Staging and Committing Changes**:
   ```bash
   # Stage specific files
   git add file1.js file2.js
   
   # Stage all files
   git add .
   
   # Commit changes with a message
   git commit -m "Add feature: user profile editing"
   ```

4. **Push Changes to GitHub**:
   ```bash
   # Push to your branch
   git push origin feature/new-feature
   ```

5. **Pull Latest Changes**:
   ```bash
   # Pull from main branch
   git pull origin main
   ```

### Branching Strategy

Follow this workflow for changes:

1. **Create a branch** for each feature, bugfix, or task:
   ```bash
   git checkout -b feature/user-authentication
   git checkout -b bugfix/login-error
   git checkout -b task/update-dependencies
   ```

2. **Make your changes**, commit often with clear messages.

3. **Pull the latest main branch** before submitting a pull request:
   ```bash
   git checkout main
   git pull origin main
   git checkout feature/your-feature
   git merge main
   ```

4. **Push your branch** to GitHub and create a pull request through the GitHub interface.

### Handling Merge Conflicts

Conflicts occur when the same part of code is modified differently in two branches. To resolve them:

1. **Identify the conflict**:
   ```bash
   git status
   ```
   Files with conflicts will be marked as "both modified"

2. **Open the conflicted files** in your editor. Look for conflict markers:
   ```
   <<<<<<< HEAD
   // Your changes
   =======
   // Changes from the branch you're merging
   >>>>>>> feature/branch-name
   ```

3. **Resolve conflicts** by editing the files to keep the appropriate code and removing the conflict markers.

4. **Stage the resolved files**:
   ```bash
   git add resolved-file.js
   ```

5. **Complete the merge**:
   ```bash
   git commit
   ```
   (This will use a default merge commit message)

6. **Push the resolved changes**:
   ```bash
   git push origin your-branch-name
   ```

### Pull Requests and Code Review

1. **Create a Pull Request (PR)** on GitHub after pushing your branch.

2. **Request reviews** from team members.

3. **Address review comments** by making additional commits to your branch.

4. **Merge the PR** once it's approved, using the GitHub interface.

5. **Delete the branch** after it's merged (can be done through GitHub interface).

### Best Practices

- **Commit early and often** with clear, descriptive messages.
- **Pull regularly** from the main branch to stay updated.
- **Create focused branches** for specific tasks.
- **Write descriptive commit messages** in the imperative form (e.g., "Add feature" not "Added feature").
- **Review your own code** before requesting reviews from others.
- **Never force push** to shared branches like main or develop.