import os
from werkzeug.utils import secure_filename
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
from extensions import db
from models import User, ArtistProfile, Availability, Booking, Announcement, Review, Notification
from sqlalchemy.exc import SQLAlchemyError
from flask_migrate import Migrate

# Create app
app = Flask(__name__)
CORS(app)

# Config
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://postgres:sam%40music2@localhost:5432/musician_booking'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = '7924'  # 🔥 Change to strong secret in production

db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# ----------------- Utility Function -----------------
def create_notification(user_id, content):
    notification = Notification(user_id=user_id, content=content)
    db.session.add(notification)
    db.session.commit()

# ----------------- Routes -----------------
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not all([username, email, password, role]):
        return jsonify({'message': 'Missing required fields'}), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({'message': 'User already exists'}), 400

    user = User(username=username, email=email, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and user.check_password(password):
        # Use user.id as identity, and put username/role in additional_claims
        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={
                "username": user.username,
                "role": user.role
            }
        )
        return jsonify({'access_token': access_token}), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401

@app.route('/book', methods=['POST'])
@jwt_required()
def book_artist():
    data = request.json
    artist_id = data.get('artist_id')
    event_date = data.get('event_date')
    price = data.get('price')
    message = data.get('message')

    if not all([artist_id, event_date, price, message]):
        return jsonify({'message': 'Missing booking details'}), 400

    organizer_id = get_jwt_identity()
    organizer = User.query.get(organizer_id)

    booking = Booking(
        artist_id=artist_id,
        event_date=event_date,
        price=price,
        message=message,
        organizer_id=organizer_id
    )
    db.session.add(booking)
    db.session.commit()

    create_notification(artist_id, f"New booking request from {organizer.username}")

    return jsonify({'message': 'Artist booked successfully'}), 201

@app.route("/artists", methods=["GET"])
def get_artists():
    profiles = ArtistProfile.query.all()
    artist_list = []
    for profile in profiles:
        user = User.query.get(profile.artist_id)
        artist_list.append({
            "id": profile.artist_id,
            "name": user.username if user else "Unknown Artist",
            "genre": profile.genres,
            "profile_pic_url": user.profile_pic if user and user.profile_pic else None,
        })
    return jsonify(artist_list)


@app.route('/organizer/bookings', methods=['GET'])
@jwt_required()
def get_organizer_bookings():
    organizer_id = get_jwt_identity()
    bookings = Booking.query.filter_by(organizer_id=organizer_id).all()

    booking_list = []
    for b in bookings:
        booking_list.append({
            'id': b.id,
            'artist_id': b.artist_id,
            'event_date': b.event_date.isoformat() if b.event_date else None,
            'status': b.status,
            'price': b.price,
            'message': b.message
        })

    return jsonify({'bookings': booking_list}), 200

@app.route('/organizer/profile', methods=['POST'])
@jwt_required()
def create_or_update_organizer_profile():
    identity = get_jwt_identity()
    user = User.query.get(identity)
    if not user or user.role != "organizer":
        return jsonify({'error': 'Organizer not found'}), 404
    data = request.get_json(force=True, silent=True) or {}
    user.bio = data.get('bio', user.bio)
    db.session.commit()
    return jsonify({'message': 'Organizer profile updated successfully'})

@app.route('/artist/profile', methods=['POST'])
@jwt_required()
def create_or_update_artist_profile():
    try:
        identity = get_jwt_identity()
        artist_id = identity["id"] if isinstance(identity, dict) else identity
        data = request.get_json(force=True, silent=True) or {}

        bio = data.get('bio')
        genres = data.get('genres')
        media_links = data.get('media_links')
        pricing_info = data.get('pricing_info')

        profile = ArtistProfile.query.filter_by(artist_id=artist_id).first()
        if profile:
            profile.bio = bio
            profile.genres = genres
            profile.media_links = media_links
            profile.pricing_info = pricing_info
            db.session.commit()
            return jsonify({'message': 'Artist profile updated successfully'})
        else:
            profile = ArtistProfile(
                artist_id=artist_id,
                bio=bio,
                genres=genres,
                media_links=media_links,
                pricing_info=pricing_info
            )
            db.session.add(profile)
            db.session.commit()
            return jsonify({'message': 'Artist profile created successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 422

@app.route('/artist/bookings', methods=['GET'])
@jwt_required()
def get_artist_bookings():
    artist_id = get_jwt_identity()
    bookings = Booking.query.filter_by(artist_id=artist_id).all()

    booking_list = []
    for b in bookings:
        booking_list.append({
            'id': b.id,
            'organizer_id': b.organizer_id,
            'event_date': b.event_date.isoformat() if b.event_date else None,
            'status': b.status,
            'price': b.price,
            'message': b.message
        })

    return jsonify({'bookings': booking_list}), 200

@app.route('/artist/bookings/<int:booking_id>/status', methods=['PUT'])
@jwt_required()
def update_booking_status(booking_id):
    artist_id = get_jwt_identity()
    data = request.json
    new_status = data.get('status')

    if new_status not in ['requested', 'confirmed', 'rejected', 'completed']:
        return jsonify({'message': 'Invalid status'}), 400

    booking = Booking.query.filter_by(id=booking_id, artist_id=artist_id).first()
    if not booking:
        return jsonify({'message': 'Booking not found or unauthorized'}), 404

    booking.status = new_status
    db.session.commit()

    # Notify the organizer
    organizer = User.query.get(booking.organizer_id)
    if organizer:
        create_notification(
            organizer.id,
            f"Your booking with artist {artist_id} was {new_status}."
        )

    return jsonify({'message': 'Booking status updated successfully'}), 200

@app.route('/artist/availability', methods=['POST'])
@jwt_required()
def update_availability():
    artist_id = get_jwt_identity()
    data = request.json
    date_str = data.get('date')
    is_available = data.get('is_available')

    if not date_str or is_available is None:
        return jsonify({'message': 'Date and availability status required'}), 400

    date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()

    availability = Availability.query.filter_by(artist_id=artist_id, date=date_obj).first()
    if availability:
        availability.is_available = is_available
    else:
        new_availability = Availability(artist_id=artist_id, date=date_obj, is_available=is_available)
        db.session.add(new_availability)

    db.session.commit()
    return jsonify({'message': 'Availability updated successfully'}), 200

@app.route('/artist/<int:artist_id>/availability', methods=['GET'])
def get_artist_availability(artist_id):
    availability = Availability.query.filter_by(artist_id=artist_id).all()

    availability_list = []
    for a in availability:
        availability_list.append({
            'date': a.date.isoformat(),
            'is_available': a.is_available
        })

    return jsonify({'availability': availability_list}), 200

@app.route('/reviews/<int:booking_id>', methods=['POST'])
@jwt_required()
def post_review(booking_id):
    identity = get_jwt_identity()
    user = User.query.get(identity)

    if user.role != 'organizer':
        return jsonify({'message': 'Only organizers can post reviews'}), 403

    booking = Booking.query.get(booking_id)

    if not booking or booking.organizer_id != user.id:
        return jsonify({'message': 'Booking not found or unauthorized'}), 404

    if booking.status != 'completed':
        return jsonify({'message': 'You can only review completed bookings'}), 400

    data = request.get_json()
    rating = data.get('rating')
    comment = data.get('comment')

    if not rating or not (1 <= rating <= 5):
        return jsonify({'message': 'Rating must be between 1 and 5'}), 400

    review = Review(
        artist_id=booking.artist_id,
        organizer_id=user.id,
        booking_id=booking.id,
        rating=rating,
        comment=comment
    )

    db.session.add(review)
    db.session.commit()
    create_notification(booking.artist_id, f"You received a new review from {user.username}.")

    return jsonify({'message': 'Review posted successfully'}), 201

@app.route('/reviews/artist/<int:artist_id>', methods=['GET'])
def get_reviews_for_artist(artist_id):
    reviews = Review.query.filter_by(artist_id=artist_id).all()

    result = []
    for r in reviews:
        organizer = User.query.get(r.organizer_id)
        result.append({
            'rating': r.rating,
            'comment': r.comment,
            'by': organizer.username
        })

    return jsonify({'reviews': result}), 200

@app.route('/reviews/organizer/<int:organizer_id>', methods=['GET'])
def get_reviews_by_organizer(organizer_id):
    reviews = Review.query.filter_by(organizer_id=organizer_id).all()
    result = []
    for r in reviews:
        artist = User.query.get(r.artist_id)
        result.append({
            'rating': r.rating,
            'comment': r.comment,
            'artist': artist.username if artist else "Unknown"
        })
    return jsonify({'reviews': result}), 200

@app.route('/bookings/<int:booking_id>/mark_paid', methods=['PATCH'])
@jwt_required()
def mark_booking_paid(booking_id):
    artist_id = get_jwt_identity()
    booking = Booking.query.get(booking_id)

    if not booking:
        return jsonify({'message': 'Booking not found'}), 404

    if booking.artist_id != artist_id:
        return jsonify({'message': 'You are not authorized to mark this booking as paid'}), 403

    booking.paid = True
    db.session.commit()
    create_notification(booking.organizer_id, f"Artist {booking.artist_id} marked booking {booking.id} as paid.")

    return jsonify({'message': 'Booking marked as paid successfully'})

@app.route('/announcements', methods=['POST'])
@jwt_required()
def create_announcement():
    artist_id = get_jwt_identity()
    user = User.query.get(artist_id)

    if user.role != 'artist':
        return jsonify({'message': 'Only artists can create announcements'}), 403

    data = request.get_json()
    title = data.get('title')
    content = data.get('content')

    if not title or not content:
        return jsonify({'message': 'Title and content are required'}), 400

    announcement = Announcement(
        artist_id=artist_id,
        title=title,
        content=content
    )

    db.session.add(announcement)
    db.session.commit()

    return jsonify({'message': 'Announcement created successfully'}), 201

@app.route('/announcements', methods=['GET'])
def get_announcements():
    announcements = Announcement.query.order_by(Announcement.created_at.desc()).all()

    announcement_list = []
    for a in announcements:
        artist = User.query.get(a.artist_id)
        announcement_list.append({
            'id': a.id,
            'artist_id': a.artist_id,
            'artist_name': artist.username if artist else "Unknown",
            'title': a.title,
            'content': a.content,
            'created_at': a.created_at.isoformat()
        })

    return jsonify({'announcements': announcement_list}), 200

@app.route('/announcements/my', methods=['GET'])
@jwt_required()
def get_my_announcements():
    artist_id = get_jwt_identity()
    user = User.query.get(artist_id)

    if user.role != 'artist':
        return jsonify({'message': 'Only artists can view their announcements'}), 403

    announcements = Announcement.query.filter_by(artist_id=artist_id).all()

    result = []
    for a in announcements:
        result.append({
            'id': a.id,
            'title': a.title,
            'content': a.content,
            'created_at': a.created_at
        })

    return jsonify({'announcements': result}), 200

@app.route('/announcements/artist/<int:artist_id>', methods=['GET'])
def get_announcements_for_artist(artist_id):
    announcements = Announcement.query.filter_by(artist_id=artist_id).all()

    result = []
    for a in announcements:
        result.append({
            'id': a.id,
            'title': a.title,
            'content': a.content,
            'created_at': a.created_at
        })

    return jsonify({'announcements': result}), 200

@app.route("/api/artists/<int:id>", methods=["GET"])
def get_artist(id):
    artist_profile = ArtistProfile.query.filter_by(artist_id=id).first()
    user = User.query.get(id)
    if artist_profile and user:
        return jsonify({
            "artist": {
                "artist_id": artist_profile.artist_id,
                "bio": artist_profile.bio,
                "genres": artist_profile.genres,
                "media_links": artist_profile.media_links,
                "pricing_info": artist_profile.pricing_info,
                "name": user.username,
                "profile_pic_url": user.profile_pic
            }
        })
    else:
        return jsonify({"error": "Artist not found"}), 404

@app.route('/api/organizers/<int:id>', methods=["GET"])
@jwt_required()
def get_organizer(id):
    user = User.query.get(id)
    if user and user.role == "organizer":
        profile_pic_url = (
            f"/static/profile_pics/{user.profile_pic}" if user.profile_pic else None
        )
        return jsonify({
            "organizer": {
                "organizer_id": user.id,
                "bio": user.bio or "",
                "name": user.username,  # or user.name if you prefer
                "profile_pic_url": profile_pic_url
            }
        })
    else:
        return jsonify({"error": "Organizer not found"}), 404

@app.route('/api/artists/<int:artist_id>', methods=['GET'])
@jwt_required()
def get_artist_profile(artist_id):
    user = User.query.get(artist_id)
    profile = ArtistProfile.query.filter_by(artist_id=artist_id).first()
    if not user or not profile:
        return jsonify({'error': 'Artist not found'}), 404
    return jsonify({
        'artist': {
            'artist_id': user.id,
            'name': user.username,
            'bio': profile.bio,
            'genres': profile.genres,
            'media_links': profile.media_links,
            'pricing_info': profile.pricing_info
        }
    }), 200

@app.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    identity = get_jwt_identity()
    user_id = identity["id"] if isinstance(identity, dict) else identity
    notifications = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()
    result = []
    for n in notifications:
        result.append({
            'id': n.id,
            'content': n.content,
            'is_read': n.is_read,
            'created_at': n.created_at.isoformat()
        })
    return jsonify({'notifications': result}), 200

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/profile/picture', methods=['POST'])
@jwt_required()
def upload_profile_picture():
    print("Upload endpoint hit")
    if 'picture' not in request.files:
        print("No file part in request")
        return jsonify({'error': 'No file part'}), 400
    file = request.files['picture']
    print("File received:", file)
    filename = getattr(file, 'filename', None)
    if not file or not filename:
        print("No selected file")
        return jsonify({'error': 'No selected file'}), 400
    if allowed_file(filename):
        safe_filename = secure_filename(filename)
        identity = get_jwt_identity()
        user_id = identity["id"] if isinstance(identity, dict) else identity
        final_filename = f"{user_id}_{safe_filename}"
        filepath = os.path.join(app.root_path, 'static', 'profile_pics', final_filename)
        print("app.root_path:", app.root_path)
        print("Saving file to:", filepath)
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        file.save(filepath)
        print("File saved")
        user = User.query.get(user_id)
        if user:
            user.profile_pic = f"/static/profile_pics/{final_filename}"
            db.session.commit()
            print("DB updated")
            return jsonify({'profile_pic_url': user.profile_pic}), 200
        else:
            print("User not found")
            return jsonify({'error': 'User not found'}), 404
    print("Invalid file type")
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/api/organizer/profile/picture', methods=['POST'])
@jwt_required()
def upload_organizer_profile_picture():
    identity = get_jwt_identity()
    user = User.query.get(identity)
    if not user or user.role != "organizer":
        return jsonify({'error': 'Organizer not found'}), 404
    if 'picture' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['picture']
    filename = getattr(file, 'filename', None)
    if not file or not filename:
        return jsonify({'error': 'No selected file'}), 400
    if allowed_file(filename):
        safe_filename = secure_filename(filename)
        final_filename = f"{user.id}_{safe_filename}"
        filepath = os.path.join(app.root_path, 'static', 'profile_pics', final_filename)
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        file.save(filepath)
        user.profile_pic = f"/static/profile_pics/{final_filename}"
        db.session.commit()
        return jsonify({'profile_pic_url': user.profile_pic}), 200
    return jsonify({'error': 'Invalid file type'}), 400

# ----------------- Run App -----------------
if __name__ == "__main__":
    app.run(debug=True)
