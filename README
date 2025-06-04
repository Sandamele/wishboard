# Wishboard: Feedback & Roadmap SaaS Tool

Wishboard is a web application that allows users to submit and vote on feature feedback, comment on suggestions, and view a public product roadmap. It's built using **React**, **Node.js/Express**, and **PostgreSQL**, with authentication via **Passport.js** supporting both email/password and Google OAuth. The project follows a **monorepo** structure, and is designed with production-readiness in mind using **Docker**, **CI/CD**, and **Sentry** for monitoring.

---

## 🚧 Architecture Overview

### Frontend (client/)

* **React app** (Create React App or Vite)
* State management: Context or Redux
* Routing: React Router
* API calls: Axios or Fetch
* Styling: Tailwind CSS, CSS modules, or UI library

### Backend (server/)

* **Node.js with Express**
* RESTful API
* Authentication: Passport.js (local + Google OAuth)
* Middleware for sessions, JWT, RBAC (role-based access control)

### Database

* **PostgreSQL**
* Tables for Users, Feedback, Votes, Comments
* One-to-many and many-to-many relationships

### Monorepo

```
/ (root)
├── client/              # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   └── package.json
│
├── server/              # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── config/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── index.js
│   ├── Dockerfile
│   ├── .env
│   └── package.json
│
├── .github/             # GitHub Actions workflows
├── README.md
└── ...
```

### Authentication

* **Email/Password**: Passport LocalStrategy with bcrypt password hashing
* **Google OAuth**: Passport GoogleStrategy with client ID/secret and callback URL
* Automatically create user if logging in via Google for the first time

---

## 🚀 Production Setup

* **Frontend**: Deployed to Vercel
* **Backend**: Deployed to Railway or Render
* **Secrets**: Managed via Vercel and Railway environment variable systems
* **Containerization**: Dockerfile with multi-stage build for the backend

---

## 📊 Monitoring

* **Sentry**:

  * Backend: `@sentry/node`
  * Frontend: `@sentry/react`
  * Use `Sentry.init({ dsn: 'https://<key>@sentry.io/<project>' })` to capture errors and performance issues

---

## 📁 Client Notes

* **components/**: Reusable UI components (e.g. `<Header>`, `<FeedbackCard>`, `<CommentForm>`)
* **pages/**: Top-level pages for routes (Home, Login, FeedbackDetail, Roadmap, AdminDashboard)
* **contexts/**: React Context providers (e.g. AuthContext)
* **services/**: API service wrappers for communicating with the backend

---

## 📁 Server Notes

* **routes/**: Express route handlers grouped by resource
* **controllers/**: Functions to handle business logic
* **models/**: Database schema or ORM logic (Knex/Prisma/Sequelize)
* **middleware/**: For authentication, authorization, and error handling
* **config/**: Passport strategies, DB configs
* **utils/**: Helper functions (e.g. validation, logging)
* **index.js**: Starts the Express app

Use `npm run dev` (with nodemon) for development and `npm start` for production.

---

This file describes the architecture, setup, and folder structure of Wishboard. For more detailed implementation (e.g., database schema, API routes, CI/CD workflows), see the corresponding sections in the project repo.
