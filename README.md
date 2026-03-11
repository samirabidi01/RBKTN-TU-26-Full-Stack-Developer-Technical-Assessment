# RBKTN-TU-26-Full-Stack-Developer-Technical-Assessment
# Full Stack Developer Technical Assessment

## Overview

This assessment is designed to evaluate your ability to build a **full stack web application** using modern JavaScript technologies.
You will build a **Team Task Manager** where users can create teams and collaborate on tasks.

The goal is to evaluate your understanding of:

* Full stack architecture
* Authentication and authorization
* API design
* Database modeling
* React application structure
* Clean and maintainable code

You are **free to choose any database** you prefer (MongoDB, PostgreSQL, MySQL, SQLite, etc.).

---

# Project: Team Task Manager

Build a full stack web application where users can create teams and manage tasks collaboratively.

---

# Technical Requirements

You must use:

* **Node.js**
* **Express.js**
* **React**
* **Authentication using JWT**

Database:

You are **free to choose the database** you prefer.

Examples:

* MongoDB
* PostgreSQL
* MySQL
* SQLite
* Any other database you are comfortable with

---

# Functional Requirements

## 1. Authentication

Users must be able to:

* Register
* Login
* Logout

Rules:

* Passwords must be securely **hashed**
* Authentication must use **JWT**
* Some routes must be **protected**

Protected routes should include:

* Creating tasks
* Creating teams
* Viewing private team tasks

---

# 2. User Profile

Each user should have at least the following information:

* name
* email
* password
* role (user or admin)
* createdAt

Users must be able to:

* View their profile
* Update their name

---

# 3. Teams

A user should be able to create and manage teams.

A team should include:

* name
* owner
* members
* createdAt

Required features:

* Create a team
* Join a team using a team ID
* View teams the user belongs to

---

# 4. Tasks

Tasks belong to a specific team.

Each task should contain:

* title
* description
* status (todo, doing, done)
* assigned user
* teamId
* createdBy
* createdAt

Users must be able to:

* Create tasks
* Assign tasks to team members
* Update task status
* Delete their own tasks

---

# Frontend Requirements

Build a **React application** with the following pages:

* Login page
* Register page
* Dashboard
* Team page
* Profile page

### Dashboard

The dashboard should display:

* The teams the user belongs to
* Tasks assigned to the user

### Team Page

The team page should display:

* All team tasks
* A form to create new tasks

---

# General Requirements

Your application should include:

* A clear **folder structure**
* Proper **API route organization**
* **Error handling**
* **Clean and readable code**

You may use:

* Axios or Fetch for API calls
* React Router for navigation
* Context API or another state management solution

UI libraries are allowed but **not required**.

---

# Bonus Features (Optional)

These features are optional but will add extra value to your project:

* Search tasks
* Filter tasks by status
* Role based permissions (admin can delete any task)
* Pagination
* Real-time updates using websockets
* Task comments
* Better UI/UX

---

# Submission Instructions

Please provide:

1. A **GitHub repository**
2. A **README explaining how to run the project**
3. Clear instructions for:

   * Installing dependencies
   * Running the backend
   * Running the frontend

---

# Evaluation Criteria

Your submission will be evaluated based on:

* Application architecture
* Authentication implementation
* API design
* Database modeling
* Code quality and readability
* Error handling
* User experience

---

