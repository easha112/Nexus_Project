#  Nexus Project

A full-stack MERN application with authentication, real-time communication, and document/meeting management features.

---

##  Features

- User Authentication (Login / Register with JWT)
- Secure Password Hashing
- Role-based API access
- Real-time communication using Socket.IO
- Meeting / session management
- Document upload system
- REST API backend
- Responsive React frontend
- MongoDB Atlas database integration

---

##  Tech Stack

### Frontend
- React (Vite)
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Socket.IO
- JWT Authentication
- CORS & dotenv

---

## Project Structure
Nexus_Project/
│
├── backend/
│ ├── server.js
│ ├── routes/
│ ├── config/
│ └── models/
│
├── frontend/
│ ├── src/
│ ├── services/
│ └── components/


---

##  Deployment

- Frontend: Vercel / Railway
- Backend: Railway
- Database: MongoDB Atlas

---

##  Environment Variables

### Backend (.env)


MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key


---

## How to Run Locally

### Backend


cd backend
npm install
npm start


### Frontend


cd frontend
npm install
npm run dev


---

## API Base URL


https://your-backend-url.railway.app/api


## License

This project is for educational purposes.
