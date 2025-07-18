
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

## Screenshots

### 1. Homepage
![Homepage](screenshots/6284803e-e52c-4ea9-939d-48981da00103.png)

### 2. Register Page
![Register](screenshots/0aef6d29-931e-4aa1-8749-8b5c3a8c3979.png)

### 3. Login Page
![Login](screenshots/2a5e9c67-a1d0-49e3-8317-e2750c797232.png)

### 4. Booking Page
![Booking](screenshots/c8961437-ab00-4e09-8824-f5f5b83cb1a3.png)


Author
------
Krishnendra Samarth  
GitHub: https://github.com/KrishnendraSamarth

