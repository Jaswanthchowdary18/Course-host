# Course Host – Full Stack Application

A full-stack course hosting web application where users can sign up, log in, and browse courses.

---

## Tech Stack
- Frontend: React, Vite, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL
- Deployment: Render

---

## Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/Jaswanthchowdary18/Course-host.git
cd Course-host


###2. Install Dependencies
npm install
cd client && npm install
cd ..

3. Environment Variables

Create a .env file in the root folder:

DATABASE_URL=postgresql://username:password@localhost:5432/course_host
PORT=5000
NODE_ENV=development

4. Run Application
npm run dev


App runs at:

http://localhost:5000

Deployment on Render
1. Create PostgreSQL Database

Render → New → PostgreSQL

Copy Internal Database URL

2. Create Web Service

Render → New → Web Service

Connect GitHub repository

Runtime: Node

Build Command

npm install && npm run build


Start Command

npm run start

3. Add Environment Variables
DATABASE_URL=<render-postgres-internal-url>
NODE_ENV=production

4. Deploy

Render automatically deploys on every GitHub push.

Notes

Backend binds to process.env.PORT (required for Render)

Free Render instances may sleep on inactivity

Author

Jaswanth Chowdary


---

### ✅ This README:
- Fits GitHub editor perfectly  
- Uses proper Markdown headings & code blocks  
- Is short, clean, and professional  
- Suitable for **college submission + recruiters**

If you want, I can next:
- ✔️ Verify your Render service is LIVE
- ✔️ Add a **Live Demo link**
- ✔️ Add **project screenshots**
- ✔️ Convert this into **project report format**

Just tell me 👌
