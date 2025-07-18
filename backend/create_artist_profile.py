from app import app, db, ArtistProfile

with app.app_context():
    profile = ArtistProfile(
        artist_id=17,  # Replace 17 with your actual user id
        bio="Test bio for unique artist",
        genres="jazz,blues",
        media_links="http://example.com",
        pricing_info="1500"
    )
    db.session.add(profile)
    db.session.commit()
    print("Profile created for artist_unique1!") 