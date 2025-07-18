from extensions import db
from datetime import datetime

from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(50), nullable=False)  # 'artist' or 'organizer'
    name = db.Column(db.String(120))
    profile_pic = db.Column(db.String, nullable=True)
    bio = db.Column(db.Text, nullable=True)

    artist_profile = db.relationship('ArtistProfile', backref='user', uselist=False)
    availability = db.relationship('Availability', backref='user')
    bookings_as_artist = db.relationship('Booking', backref='artist', foreign_keys='Booking.artist_id')
    bookings_as_organizer = db.relationship('Booking', backref='organizer', foreign_keys='Booking.organizer_id')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class ArtistProfile(db.Model):
    artist_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    bio = db.Column(db.Text)
    genres = db.Column(db.String(200))
    media_links = db.Column(db.Text)
    pricing_info = db.Column(db.String(200))

    def serialize(self):
        user = User.query.get(self.artist_id)
        return {
            "artist_id": self.artist_id,
            "bio": self.bio,
            "genres": self.genres,
            "media_links": self.media_links,
            "pricing_info": self.pricing_info,
            "name": user.username if user else "",
        }






class Availability(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    artist_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    date = db.Column(db.Date)
    is_available = db.Column(db.Boolean)

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    artist_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    organizer_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    event_date = db.Column(db.Date)
    status = db.Column(db.String(50))  # requested, confirmed, rejected, completed
    price = db.Column(db.Integer)
    message = db.Column(db.Text)
    paid = db.Column(db.Boolean, default=False)

class Announcement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    artist_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200))
    content = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    artist_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    organizer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    booking_id = db.Column(db.Integer, db.ForeignKey('booking.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1 to 5
    comment = db.Column(db.Text, nullable=True)

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    content = db.Column(db.String(300))
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
