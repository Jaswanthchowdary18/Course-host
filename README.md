# Course Host – Full Stack Application

A full-stack course hosting web application where users can sign up, log in, and browse available courses.

---

## Tech Stack

Frontend: React, Vite, TypeScript, Tailwind CSS  
Backend: Node.js, Express, TypeScript  
Database: PostgreSQL  
Deployment: Render  

---

## Features

- User authentication (Sign Up & Login)
- Session-based authentication
- Browse available courses
- View course details
- Responsive UI
- PostgreSQL database integration

---

## Local Development Setup

### Clone Repository

git clone https://github.com/Jaswanthchowdary18/Course-host.git  
cd Course-host  

### Install Dependencies

npm install  
cd client  
npm install  
cd ..  

### Environment Variables

Create a `.env` file in the root directory:

DATABASE_URL=postgresql://username:password@localhost:5432/course_host  
PORT=5000  
NODE_ENV=development  

### Run Application

npm run dev  

Application runs at:  
http://localhost:5000  

---

## Deployment on Render

### Create PostgreSQL Database

Render Dashboard → New → PostgreSQL  
Create database  
Copy Internal Database URL  

### Create Web Service

Render → New → Web Service  
Connect GitHub repository  
Select branch: main  
Runtime: Node  

Build Command:  
npm install && npm run build  

Start Command:  
npm run start  

### Environment Variables (Render)

DATABASE_URL=<render-postgres-internal-url>  
NODE_ENV=production  

### Deploy

Click Deploy  
Render will automatically deploy on every GitHub push  

---

## Notes

- Free Render instances may sleep during inactivity
- First request may take up to 50 seconds
- Server must listen on process.env.PORT in production

---

## Author

Jaswanth Chowdary
