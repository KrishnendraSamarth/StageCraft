from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Booking, Review, User

artist_bp = Blueprint('artist', __name__)

@artist_bp.route('/artist/dashboard', methods=['GET'])
@jwt_required()
def artist_dashboard():
    artist_id = get_jwt_identity()

    # Fetch bookings for this artist
    bookings = Booking.query.filter_by(artist_id=artist_id).all()
    booking_list = []
    for b in bookings:
        organizer = User.query.get(b.organizer_id)
        booking_list.append({
            'organizer_name': organizer.username,
            'organizer_email': organizer.email,
            'date': b.event_date.strftime('%Y-%m-%d') if b.event_date else None,
            'status': b.status,
            'paid': False  # Update later when payment logic added
        })

    # Fetch reviews for this artist
    reviews = Review.query.filter_by(artist_id=artist_id).all()
    review_list = []
    for r in reviews:
        organizer = User.query.get(r.organizer_id)
        review_list.append({
            'rating': r.rating,
            'comment': r.comment,
            'by': organizer.username
        })

    return jsonify({
        'bookings': booking_list,
        'reviews': review_list
    })
