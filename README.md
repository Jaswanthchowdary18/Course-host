Course Host – Full Stack Application

A full-stack course hosting web application where users can sign up, log in, and browse available courses.

Tech Stack

Frontend: React, Vite, TypeScript, Tailwind CSS
Backend: Node.js, Express, TypeScript
Database: PostgreSQL
Deployment: Render

Features

User authentication (Sign Up & Login)
Session-based authentication
Browse available courses
View course details
Responsive UI
PostgreSQL database integration

Local Development Setup
1. Clone Repository

git clone https://github.com/Jaswanthchowdary18/Course-host.git

cd Course-host

2. Install Dependencies

npm install
cd client
npm install
cd ..

3. Environment Variables

Create a .env file in the root directory and add:

DATABASE_URL=postgresql://username:password@localhost:5432/course_host
PORT=5000
NODE_ENV=development

4. Run Application

npm run dev

Application runs at:
http://localhost:5000

Deployment on Render
1. Create PostgreSQL Database

Go to Render Dashboard
Click New → PostgreSQL
Create database
Copy the Internal Database URL

2. Create Web Service

Render → New → Web Service
Connect GitHub repository
Select branch: main
Runtime: Node

Build Command:
npm install && npm run build

Start Command:
npm run start

3. Add Environment Variables on Render

DATABASE_URL=<render-postgres-internal-url>
NODE_ENV=production

4. Deploy

Click Deploy
Render will automatically deploy on every GitHub push

Notes

Free Render instances may sleep when inactive and take up to 50 seconds to wake up.
Make sure the server listens on process.env.PORT in production.

Author

Jaswanth Chowdary
