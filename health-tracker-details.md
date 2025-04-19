# Health Tracker Project: Step-by-Step Requirements Checklist

This document outlines the step-by-step requirements for developing the Health Tracker application, designed for an AI coding agent to follow. The technology stack includes **React**, **HTML**, **CSS**, **JavaScript** for the front end, **Express** and **Node.js** for the back end, and **MongoDB (local)** for the database. No code should be written in this guide; it serves as a structured checklist of requirements.

---

## 1. Project Overview
The Health Tracker is a web application to help users track their diet, exercise, and health goals, with potential future integration into insurance products. The solution supports user profiles, lifestyle tracking, goal setting, and group features.

- [ ] Ensure the application is developed as a standalone solution with scalability for future insurance product integration.

---

## 2. Technology Stack
- [ ] Use **React** for front-end UI components.
- [ ] Use **HTML** and **CSS** for structuring and styling the front end.
- [ ] Use **JavaScript** for front-end interactivity.
- [ ] Use **Express** and **Node.js** for back-end API and server logic.
- [ ] Use **MongoDB (local)** for database storage.

---

## 3. User Registration (Workflow A)
The system must support user registration with profile creation, including validation and health analytics.

### 3.1 Username Creation
- [ ] Allow users to enter a username.
- [ ] Validate that the username is unique in the system.
- [ ] If the username exists, prompt the user to enter a new username.

### 3.2 Real Name Capture
- [ ] Capture the user’s real name during registration.

### 3.3 Email Address Capture and Validation
- [ ] Capture the user’s email address.
- [ ] Validate the email address format (e.g., contains `@` and a valid domain).
- [ ] If validation fails, prompt the user to correct the email before proceeding.

### 3.4 Personal Health Information
- [ ] Collect physical details, including:
  - [ ] Height.
  - [ ] Weight.
  - [ ] Additional information (e.g., age, gender) as needed for health analytics (e.g., BMI, ideal weight).
- [ ] Store this information in the MongoDB database.

### 3.5 Health Feedback
- [ ] Analyze collected information to compare against healthy norms (e.g., BMI ranges).
- [ ] If deviations are detected (e.g., unhealthy BMI), provide feedback to the user.
- [ ] Allow capture of initial goals (e.g., target weight) during registration if applicable.

---

## 4. Lifestyle Data Capture (Workflow B)
The system must support tracking exercise and diet data.

### 4.1 Exercise Capture
- [ ] Provide a form to select a type of exercise from a predefined list (e.g., running, cycling, swimming).
- [ ] Allow users to input:
  - [ ] Duration of the exercise session.
  - [ ] Distance (if applicable, e.g., for running or cycling).
- [ ] Store exercise data in MongoDB with a timestamp and user association.

### 4.2 Diet Capture
- [ ] Provide a form to select food and drink from a predefined list.
- [ ] Allow users to add custom food/drink items to the list.
- [ ] Capture:
  - [ ] Calorific count for the selected food/drink.
  - [ ] Meal type from a predefined set (e.g., breakfast, lunch, dinner, snack).
- [ ] Store diet data in MongoDB with a timestamp and user association.

---

## 5. Goal Capture and Reporting (Workflow C)
The system must support setting, tracking, and reporting goals.

### 5.1 Goal Creation
- [ ] Allow users to create goals, including:
  - [ ] Basic goals (e.g., target weight by a specific date).
  - [ ] Optional complex goals (e.g., running a set distance under a set time).
- [ ] Validate goals to ensure they are not already met (e.g., target weight is not current weight).
- [ ] If a goal is already met, notify the user and suggest setting a new goal.

### 5.2 Goal Monitoring
- [ ] On application start or during use, check if any goals have exceeded their target dates using system time.
- [ ] Display a message indicating whether the goal was met or not.
- [ ] Prompt the user to set a new goal if the previous one has expired.

### 5.3 Weight Tracking
- [ ] Require regular capture of the user’s weight to track progress toward weight-related goals.
- [ ] Optionally allow users to configure the frequency of weight capture (e.g., weekly prompts).
- [ ] Store weight updates in MongoDB with timestamps.

---

## 6. User Groups (Workflow D)
The system must support group creation, membership, and goal sharing via email.

### 6.1 Group Creation and Management
- [ ] Allow users to create groups with a unique group name.
- [ ] Store group details in MongoDB.
- [ ] Allow users to share group details via email using their registered email address.

### 6.2 Group Membership
- [ ] Allow users to join a group using a code or web link provided in the group invitation email.
- [ ] Allow users to view groups they are members of.
- [ ] Allow users to opt out by deleting their membership from a group.

### 6.3 Group Goals and Achievements
- [ ] Allow group goals to be shared via email with a code or link.
- [ ] Enable users to accept a group goal by entering the code or clicking the link, creating a local goal in their profile.
- [ ] When a user meets a goal, generate an email notification to the group members.
- [ ] Store group goal data and achievements in MongoDB.

---

## 7. Email Communication
- [ ] Implement email functionality for:
  - [ ] Sharing group details and invitations.
  - [ ] Sharing group goals.
  - [ ] Notifying group members of goal achievements.
- [ ] Ensure emails are sent from the user’s registered email address or a system email service.
- [ ] Support future scalability for replacing email with instant messaging or social network platforms (not implemented in this phase).

---

## 8. General Requirements
- [ ] Ensure all user data (profiles, exercise, diet, goals, groups) is stored securely in MongoDB.
- [ ] Implement user authentication to secure access to profiles and data.
- [ ] Design a responsive UI using React, HTML, and CSS for accessibility on desktop and mobile devices.
- [ ] Ensure all API endpoints (e.g., for registration, data capture, goal tracking) are built with Express and Node.js.
- [ ] Validate all user inputs (e.g., email format, numeric values for weight/height) on both front end and back end.
- [ ] Provide feedback to users for invalid inputs or system actions (e.g., goal met, username taken).
- [ ] Ensure the system is modular and scalable for future features (e.g., social network integration, instant messaging).

---

## 9. Notes for AI Coding Agent
- Follow the technology stack strictly: React, HTML, CSS, JavaScript, Express, Node.js, MongoDB (local).
- Do not include any code in this checklist; it is for planning purposes.
- Ensure all requirements are addressed in the order listed to maintain workflow clarity.
- Use MongoDB schemas to structure data for users, exercises, diets, goals, and groups.
- Prioritize security for user data and authentication.
- Test all features to ensure they meet the specified functionality (e.g., email validation, goal expiration checks).

---

This checklist provides a clear, AI-friendly guide to developing the Health Tracker application. Each item should be implemented and tested to ensure full compliance with the project requirements.