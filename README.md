# IRCTC Booking System

## 📌 Project Summary
Build a railway booking system like IRCTC


## Run Locally

1. Clone the project

```bash
    git clone https://github.com/Harsh-00/WorkIndia_Assignment.git
    cd WorkIndia_Assignment
```

2. Install dependencies

```bash
    npm install
```
3. Configure Environment Variables(.env sample)
   - Create your own .env file
```bash
    PORT=5000
    DB_HOST=localhost 
    DB_NAME=irctc_db
    DB_USER=postgres
    DB_PASS=<your_postgres_password>
    JWT_SECRET=supersecretkey123
    ADMIN_API_KEY=adminsecretapikey

```

4. Set Up PostgreSQL Database
- Start the Postgres Server.
- Open PostgreSQL shell or use pgAdmin
- Create a database: The DB name should match DB_NAME in your .env

```bash
  CREATE DATABASE irctc_db;
```
 
5. Start the server

```bash
  npm run start
```



## Problem Statement
Users can:
- Check trains between stations
- See seat availability
- Book a seat if available
- Must handle real-time concurrency safely (race condition protection)
- Includes role-based access: Admin & Users

## User Roles

### Admin
- Add new trains
- Update total seats for trains
- Full control over train data

### Users
- View trains between stations
- Check seat availability 
- Book a seat (need to login)
- View their own bookings (need to login)

## Tech Stack
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (compulsory)
- **ORM**: Sequelize
- **Auth**: JWT tokens (users), Role-Based
- **Testing**: Postman collection included

##  Required Features & Endpoints

###  Postman Collection

- **Shared Online**: [View in Postman Workspace](https://www.postman.com/workspace/My-Workspace~bbabd945-af76-441c-87f0-11754a03d297/collection/29814775-cd043651-e1b7-4159-aba4-4dd57d4640c9?action=share&creator=29814775)

- **Alternate Download**: 📥 [Download Postman Collection](./IRCTC_API_Postman_Collection.json)



### 1. User Registration
- `POST /api/auth/register`
- Creates new users (role: user or admin)

### 2. User Login
- `POST /api/auth/login`
- Returns a JWT token

### 3. Add or Update Train (Admin only)
- `POST /api/trains`
- Adds a new train OR updates seat count if train already exists
- Protected via `x-api-key`

### 4. Get Trains by Route
- `GET /api/trains?source=X&destination=Y`
- Returns list of trains between two stations

### 5. Seat Availability
- `GET /api/booking/availability?source=X&destination=Y`
- Shows total & available seats per train

### 6. Book a Seat (User only)
- `POST /api/booking/book`
- Books next available seat if any left
- Can Book single ticket at a time.
- Requires `Authorization: Bearer <token>`
- Fully race-condition safe

### 7. Get My Bookings
- `GET /api/booking/me`
- Shows bookings made by the logged-in user
- Requires `Authorization: Bearer <token>`

## Assumptions
- Users can only book one seat per API call. Group bookings are not implemented.
- The system auto-assigns the lowest-numbered available seat in a train.
- Tables are automatically created/updated when the app starts
- Run this locally using Node.js and PostgreSQL without Docker.

## Security Features
- ✅ Admin APIs protected by API Key (`x-api-key`)
- ✅ User APIs protected by JWT token (`Authorization: Bearer <token>`)
- ✅ Race-condition protection in booking logic using PostgreSQL transactions and row-level locking



## API Endpoints

| Method | Route                                             | Auth              | Description                  |
|--------|---------------------------------------------------|-------------------|------------------------------|
| POST   | `/api/auth/register`                              | ❌                | Register new user            |
| POST   | `/api/auth/login`                                 | ❌                | Login and receive JWT        |
| POST   | `/api/trains`                                     | ✅ Admin (API Key) | Add or update train info     |
| GET    | `/api/trains?source=A&destination=B`              | ❌                | Get trains between stations  |
| GET    | `/api/booking/availability?source=A&destination=B`| ❌                | Check available seats        |
| POST   | `/api/booking/book`                               | ✅ User (JWT)      | Book a seat                  |
| GET    | `/api/booking/me`                                 | ✅ User (JWT)      | View user's bookings         |
