#  BACKEND README (Node + Express + MongoDB)

# Secure Assessment Portal - Backend

## 🚀 Tech Stack Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Brevo SMTP (Email Service)
- dotenv
- REST API Architecture

---

##  Features

### Authentication
- Admin Login
- Candidate OTP Login
- JWT-based authorization
- Role-based middleware

###  Admin Features
- Create Question API
- Update Question API
- Delete Question API
- Create Candidate API
- Update Candidate API
- Delete Candidate API
- View Candidate Attempts
- View Results & Scores

###  Candidate Features
- OTP generation & verification
- Start assessment attempt
- Submit assessment
- Auto-expire attempt
- One-time attempt restriction

###  Assessment Management
- Timer calculation from server
- Remaining time API
- Attempt status tracking:
  - IN_PROGRESS
  - SUBMITTED
  - EXPIRED

### Attempt System
- Store answers
- Calculate score
- Store submission timestamp
- Prevent resubmission

---

## Database Models

### User
- name
- email
- phone
- role

### Question
- question
- options
- correctAnswer

### Attempt
- userId
- duration
- startTime
- status
- answers[]
- score
- submittedAt

---

##  Security Implemented
- JWT Middleware
- Role-based Access Control
- One Attempt Validation
- Server-side Timer Validation
- IP restricted SMTP (Brevo)

---

## Project Setup

npm install
npm run dev




### Installation (Backend)
1 Clone the repository
git remote add origin https://github.com/mohammad-danish-ansari/STEE_Delta_server/tree/master
git pull origin master

### folder structure
controllers/v1/website
             /user
             /attempt
             /question
models
       /helpers
      /repositories
     /models
routes/v1
config
     /dbconnect
     /option
app.js
package.json




### Install Required Packages 
npm install express mongoose cors dotenv
npm install --save-dev nodemon