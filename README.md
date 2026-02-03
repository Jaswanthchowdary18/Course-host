# Course Host – Full Stack Application

A full-stack course hosting web application where users can sign up, log in, and browse available courses.

---

## Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS  
- **Backend:** Node.js, Express, TypeScript  
- **Database:** PostgreSQL  
- **Deployment:** Render  

---

## Features

- User authentication (Sign Up / Login)
- Secure session-based authentication
- Browse available courses
- View course details
- Responsive modern UI
- Full-stack integration with PostgreSQL

---

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/Jaswanthchowdary18/Course-host.git
cd Course-host


npm install
cd client && npm install
cd ..


DATABASE_URL=postgresql://username:password@localhost:5432/course_host
PORT=5000
NODE_ENV=development


npm run dev


http://localhost:5000


DATABASE_URL=<render-postgres-internal-url>
NODE_ENV=production


