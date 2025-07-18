from app import app, db, Availability

with app.app_context():
    # Example: change artist_id and date as needed
    new_availability = Availability(
        artist_id=1,           # Replace 1 with your artist's actual ID
        date='2025-07-20',
        is_available=True
    )
    db.session.add(new_availability)
    db.session.commit()

    print("Availability seeded successfully!")
