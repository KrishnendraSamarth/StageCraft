from flask import Flask, jsonify
from models import ArtistProfile, User

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(debug=True) 