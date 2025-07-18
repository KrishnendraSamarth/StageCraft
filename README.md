
StageCraft - Artist Booking Platform
====================================

StageCraft is a full-stack web application that connects artists and event organizers through a seamless artist booking platform. Built with a React frontend and a Flask backend, StageCraft provides an easy and secure way to explore, book, and manage music talent for events.

Features
--------
- Artist registration with profile, bio, genres, and images
- Organizer registration and login
- Browse and search for artists
- Organizer can book artists for events
- Booking request management
- Artists can accept or reject booking requests
- Secure authentication with JWT
- Upload profile pictures
- Smart backend powered by Flask & SQLAlchemy

Tech Stack
----------
Frontend:
- React.js
- Tailwind CSS
- React Router DOM

Backend:
- Flask
- Flask-JWT-Extended
- Flask-SQLAlchemy
- PostgreSQL (via pgAdmin)
- Flask-Migrate
- Flask-CORS

Setup Instructions
------------------

1. Clone the repository

    git clone https://github.com/KrishnendraSamarth/StageCraft.git
    cd StageCraft

2. Backend Setup

    cd backend
    python -m venv venv
    .\venv\Scripts\activate
    pip install -r requirements.txt

- Configure .env file with your PostgreSQL URI:
    DATABASE_URL=postgresql://username:password@localhost:5432/dbname
    SECRET_KEY=your-secret-key

- Run migrations:
    flask db init
    flask db migrate
    flask db upgrade
    flask run

3. Frontend Setup

    cd ../frontend
    npm install
    npm run dev

Project Structure
-----------------
Musician Booking/
├── backend/
│   ├── app.py
│   ├── models/
│   ├── routes/
│   └── migrations/
├── frontend/
│   ├── src/
│   └── public/
├── .gitignore
├── README.txt

## 📸 Screenshots

### 🔐 Login Page
![Login Page](screenshots/login.jpg)

---

### 🎤 Artists List
![Artists List](screenshots/artists.jpg)

---

### 📅 Booking Page
![Booking Page](screenshots/bookings.jpg)

---

### 📊 Dashboard Overview
![Dashboard Overview](screenshots/dashboard.jpg)

---

### 📈 Dashboard Analytics
![Dashboard Analytics](screenshots/dashboard2.jpg)



Author
------
Krishnendra Samarth  
GitHub: https://github.com/KrishnendraSamarth

