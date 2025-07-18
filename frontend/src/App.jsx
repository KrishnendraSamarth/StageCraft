import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from "react-router-dom";
import { FaUser, FaCalendarAlt, FaBullhorn, FaStar, FaBell, FaUsers } from "react-icons/fa";
import axios from "axios";

// Helper to decode JWT (without verifying signature)
function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function MusicBackgroundUnified() {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Unified gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600" />
      {/* Randomly scattered music notes and Indian instrument SVG overlays */}
      <svg className="absolute inset-0 w-full h-full opacity-30 select-none pointer-events-none" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Music notes */}
        <text x="100" y="300" fontSize="260" fill="#a5b4fc" opacity="0.8" transform="rotate(-8 100 300)">&#119070;</text>
        <text x="900" y="200" fontSize="180" fill="#fbbf24" opacity="0.7" transform="rotate(12 900 200)">&#119070;</text>
        <text x="600" y="700" fontSize="120" fill="#5eead4" opacity="0.7" transform="rotate(-15 600 700)">&#119070;</text>
        <text x="1100" y="100" fontSize="100" fill="#f472b6" opacity="0.6" transform="rotate(10 1100 100)">&#119070;</text>
        <text x="250" y="60" fontSize="80" fill="#fff" opacity="0.5" transform="rotate(-5 250 60)">&#119070;</text>
        <text x="700" y="400" fontSize="90" fill="#a21caf" opacity="0.6" transform="rotate(8 700 400)">&#119070;</text>
        {/* Tabla silhouettes (randomly placed) */}
        <g opacity="0.22">
          <ellipse cx="120" cy="700" rx="42" ry="24" fill="#f59e42" />
          <ellipse cx="120" cy="700" rx="18" ry="10" fill="#fff" />
        </g>
        <g opacity="0.18">
          <ellipse cx="1050" cy="650" rx="32" ry="18" fill="#fde68a" />
          <ellipse cx="1050" cy="650" rx="12" ry="7" fill="#fff" />
        </g>
        {/* Guitar silhouettes (randomly placed) */}
        <g opacity="0.18">
          <ellipse cx="1020" cy="120" rx="38" ry="22" fill="#f87171" />
          <ellipse cx="1060" cy="120" rx="18" ry="12" fill="#fbbf24" />
          <rect x="1060" y="110" width="12" height="70" rx="6" fill="#fbbf24" transform="rotate(-15 1060 110)" />
        </g>
        <g opacity="0.15">
          <ellipse cx="300" cy="600" rx="28" ry="18" fill="#fbbf24" />
          <ellipse cx="320" cy="600" rx="14" ry="10" fill="#f59e42" />
          <rect x="320" y="590" width="8" height="50" rx="4" fill="#fbbf24" transform="rotate(-10 320 590)" />
        </g>
        {/* Tanpura silhouettes (randomly placed) */}
        <g opacity="0.18">
          <rect x="60" y="60" width="18" height="180" rx="9" fill="#fbbf24" transform="rotate(-8 60 60)" />
          <ellipse cx="69" cy="240" rx="32" ry="24" fill="#fde68a" />
        </g>
        <g opacity="0.15">
          <rect x="900" y="500" width="14" height="120" rx="7" fill="#fbbf24" transform="rotate(12 900 500)" />
          <ellipse cx="907" cy="630" rx="22" ry="16" fill="#fde68a" />
        </g>
        {/* Veena silhouettes (randomly placed) */}
        <g opacity="0.15">
          <rect x="700" y="340" width="100" height="14" rx="7" fill="#a21caf" transform="rotate(-10 700 340)" />
          <ellipse cx="800" cy="345" rx="18" ry="18" fill="#a21caf" />
        </g>
        <g opacity="0.13">
          <rect x="400" y="200" width="80" height="10" rx="5" fill="#a21caf" transform="rotate(20 400 200)" />
          <ellipse cx="480" cy="205" rx="14" ry="14" fill="#a21caf" />
        </g>
      </svg>
      {/* Optional: add a faint waveform */}
      <svg className="absolute left-0 top-0 w-1/2 max-w-lg opacity-10 select-none pointer-events-none" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 60 Q 100 20 200 60 T 400 60" stroke="#fff" strokeWidth="10" fill="none" />
      </svg>
    </div>
  );
}

function AuthBrandingUnified() {
  return (
    <div className="flex flex-col items-center mb-12 mt-20 select-none">
      <span
        className="text-7xl font-extrabold tracking-tight font-serif mb-4 drop-shadow-[0_6px_32px_rgba(0,0,0,0.8)]"
        style={{
          color: "#fff",
          textShadow: "0 6px 40px #6366f1, 0 2px 12px #000, 0 1px 0 #fff"
        }}
      >
        STAGECRAFT
      </span>
      <span className="text-white text-2xl max-w-2xl text-center font-semibold drop-shadow-lg">
        STAGECRAFT is your one-stop platform to <span className="text-teal-200 font-bold">discover</span>, <span className="text-blue-200 font-bold">book</span>, and <span className="text-purple-200 font-bold">connect</span> with talented artists for any event.
      </span>
    </div>
  );
}

// Login Form Component
function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <MusicBackgroundUnified />
      <AuthBrandingUnified />
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="text-sm mt-2 text-center">
            Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
          </div>
        </form>
      </div>
    </div>
  );
}

// Register Form Component
function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("artist");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <MusicBackgroundUnified />
      <AuthBrandingUnified />
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="artist">Artist</option>
            <option value="organizer">Organizer</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <div className="text-sm mt-2 text-center">
            Already have an account? <a href="/" className="text-blue-600 hover:underline">Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="w-full flex justify-center items-center bg-gradient-to-r from-blue-700 to-blue-500 py-4 mb-8 shadow">
      <span className="text-4xl font-extrabold tracking-tight text-white font-serif drop-shadow-lg text-center">STAGECRAFT</span>
    </header>
  );
}

function DashboardMusicBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600" />
      <svg className="absolute inset-0 w-full h-full opacity-20 select-none pointer-events-none" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="100" y="300" fontSize="180" fill="#a5b4fc" opacity="0.7" transform="rotate(-8 100 300)">&#119070;</text>
        <text x="900" y="200" fontSize="120" fill="#fbbf24" opacity="0.5" transform="rotate(12 900 200)">&#119070;</text>
        <ellipse cx="500" cy="700" rx="60" ry="18" fill="#f472b6" fillOpacity="0.12" />
        {/* Tabla */}
        <g opacity="0.13">
          <ellipse cx="120" cy="700" rx="32" ry="18" fill="#f59e42" />
          <ellipse cx="120" cy="700" rx="12" ry="7" fill="#fff" />
        </g>
        {/* Guitar */}
        <g opacity="0.13">
          <ellipse cx="1020" cy="120" rx="28" ry="18" fill="#f87171" />
          <ellipse cx="1060" cy="120" rx="14" ry="10" fill="#fbbf24" />
          <rect x="1060" y="110" width="12" height="70" rx="6" fill="#fbbf24" transform="rotate(-15 1060 110)" />
        </g>
        {/* Tanpura */}
        <g opacity="0.13">
          <rect x="60" y="60" width="18" height="180" rx="9" fill="#fbbf24" transform="rotate(-8 60 60)" />
          <ellipse cx="69" cy="240" rx="32" ry="24" fill="#fde68a" />
        </g>
      </svg>
    </div>
  );
}

function Dashboard() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [profilePicUrl, setProfilePicUrl] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const payload = parseJwt(token);
    setUser(payload);

    // Always fetch the latest profile for profile_pic_url
    if (token && payload) {
      const artistId = payload.sub?.id || payload.id || payload.sub;
      fetch(`http://localhost:5000/api/artists/${artistId}`)
        .then(res => res.json())
        .then(data => {
          if (data.artist) setProfilePicUrl(data.artist.profile_pic_url || null);
        });
    }

    // Fetch notifications preview
    if (token) {
      fetch("http://localhost:5000/notifications", {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setNotifications(data.notifications?.slice(0, 3) || []));
      // Fetch recent bookings
      if (payload?.sub?.role === "artist" || payload?.role === "artist") {
        fetch("http://localhost:5000/artist/bookings", {
          headers: { "Authorization": `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => setRecentBookings(data.bookings?.slice(0, 3) || []));
        // Fetch recent reviews for artist
        fetch(`http://localhost:5000/reviews/artist/${payload?.sub?.id || payload?.id || payload?.sub}`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => setRecentReviews(data.reviews?.slice(0, 2) || []));
        // Fetch recent announcements for artist
        fetch("http://localhost:5000/announcements/my", {
          headers: { "Authorization": `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => setRecentAnnouncements(data.announcements?.slice(0, 2) || []));
      } else {
        fetch("http://localhost:5000/organizer/bookings", {
          headers: { "Authorization": `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => setRecentBookings(data.bookings?.slice(0, 3) || []));
        // Fetch public announcements for organizer
        fetch("http://localhost:5000/announcements")
          .then(res => res.json())
          .then(data => setRecentAnnouncements(data.announcements?.slice(0, 2) || []));
        // Fetch reviews by organizer
        fetch(`http://localhost:5000/reviews/organizer/${payload?.sub || payload?.id || payload?.sub}`)
          .then(res => res.json())
          .then(data => setRecentReviews(data.reviews?.slice(0, 2) || []));
      }
    }
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded shadow-md">Not logged in. <Link to="/">Login</Link></div>
      </div>
    );
  }

  const username = user.sub?.username || user.username || user.sub || "User";
  const role = user.sub?.role || user.role || "Unknown";

  // Quick actions for each role
  const quickActions = role === "artist"
    ? [
        { icon: <FaUser />, label: "Edit Profile", to: "/artist/profile" },
        { icon: <FaCalendarAlt />, label: "Availability", to: "/artist/availability" },
        { icon: <FaBullhorn />, label: "Announcements", to: "/artist/announcements" },
        { icon: <FaStar />, label: "My Reviews", to: "/artist/reviews" },
        { icon: <FaBell />, label: "Notifications", to: "/notifications" },
        { icon: <FaUsers />, label: "Bookings", to: "/artist/bookings" },
      ]
    : [
        { icon: <FaUsers />, label: "Browse Artists", to: "/artists" },
        { icon: <FaCalendarAlt />, label: "My Bookings", to: "/organizer/bookings" },
        { icon: <FaStar />, label: "My Reviews", to: "/organizer/reviews" },
        { icon: <FaBullhorn />, label: "Announcements", to: "/announcements" },
        { icon: <FaBell />, label: "Notifications", to: "/notifications" },
      ];

  // Playful, music-inspired greeting
  const greeting = role === "artist"
    ? `🎤 Ready to take the stage, ${username}?`
    : `🎶 Welcome to STAGECRAFT, ${username}! Your next gig is just a click away.`;

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      <DashboardMusicBackground />
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-4">
        <div className="mb-10 mt-8 text-center flex flex-col items-center">
          {role === "artist" && (
            <img
              src={profilePicUrl ? `http://localhost:5000${profilePicUrl}?t=${Date.now()}` : "/default-avatar.png"}
              alt="Profile"
              className="rounded-full w-28 h-28 object-cover border-4 border-white shadow mb-4"
            />
          )}
          <h1 className="text-5xl font-extrabold mb-2 text-white drop-shadow-lg tracking-tight">{greeting}</h1>
          <div className="text-xl text-blue-100 font-semibold mb-6">Role: {role.charAt(0).toUpperCase() + role.slice(1)}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {quickActions.map(action => (
            <Link to={action.to} key={action.label} className="flex flex-col items-center bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6 transition hover:scale-105 hover:shadow-2xl">
              <span className="text-4xl mb-2 text-blue-600">{action.icon}</span>
              <span className="font-bold text-blue-900 text-lg">{action.label}</span>
            </Link>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">🎤 Your Bookings</h2>
            <ul className="space-y-3">
              {recentBookings.length === 0 && <li className="text-gray-500">No recent bookings.</li>}
              {recentBookings.map((b, i) => (
                <li key={b.id || i} className="border rounded-lg p-3 flex flex-col bg-white/60">
                  <span className="font-semibold">Date: {b.event_date ? b.event_date.split("T")[0] : "-"}</span>
                  <span>Status: {b.status}</span>
                  {role === "artist" ? <span>Organizer: {b.organizer_id}</span> : <span>Artist: {b.artist_id}</span>}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">🔔 Notifications</h2>
            <ul className="space-y-3">
              {notifications.length === 0 && <li className="text-gray-500">No notifications.</li>}
              {notifications.map((n, i) => (
                <li key={n.id || i} className="border rounded-lg p-3 bg-blue-50/60">
                  <span>{n.content}</span>
                  <div className="text-xs text-gray-500">{n.created_at}</div>
                </li>
              ))}
            </ul>
            <Link to="/notifications" className="block mt-3 text-blue-700 hover:underline text-base font-semibold">View all</Link>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mt-10">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">🎶 Announcements from the Stage</h2>
            <ul className="space-y-3">
              {recentAnnouncements.length === 0 && <li className="text-gray-500">No announcements.</li>}
              {recentAnnouncements.map((a, i) => (
                <li key={a.id || i} className="border rounded-lg p-3 bg-white/60">
                  <span className="font-semibold">{a.title}</span>
                  <div className="text-gray-700">{a.content}</div>
                  <div className="text-xs text-gray-500">{a.created_at}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">⭐ Latest Reviews</h2>
            <ul className="space-y-3">
              {recentReviews.length === 0 && <li className="text-gray-500">No reviews.</li>}
              {recentReviews.map((r, i) => (
                <li key={i} className="border rounded-lg p-3 bg-white/60">
                  <span className="font-semibold">Rating: {r.rating} / 5</span>
                  <div className="text-gray-700">{r.comment}</div>
                  {role === "artist" ? <div className="text-xs text-gray-500">By: {r.by}</div> : <div className="text-xs text-gray-500">For Artist: {r.artist}</div>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

function ArtistList() {
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [bookingId, setBookingId] = useState(null);
  const [bookingForm, setBookingForm] = useState({ event_date: "", price: "", message: "" });
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/artists")
      .then(res => res.json())
      .then(data => {
        setArtists(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load artists");
        setLoading(false);
      });
  }, []);

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(search.toLowerCase()) ||
    (artist.genre && artist.genre.toLowerCase().includes(search.toLowerCase()))
  );

  const handleBookClick = (artistId) => {
    setBookingId(artistId);
    setBookingForm({ event_date: "", price: "", message: "" });
    setBookingSuccess("");
    setBookingError("");
  };

  const handleBookingSubmit = async (e, artistId) => {
    e.preventDefault();
    setBookingSuccess("");
    setBookingError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          artist_id: artistId,
          event_date: bookingForm.event_date,
          price: bookingForm.price,
          message: bookingForm.message
        })
      });
      const data = await res.json();
      if (res.ok) {
        setBookingSuccess("Booking request sent!");
        setBookingId(null);
      } else {
        setBookingError(data.message || "Failed to book artist");
      }
    } catch {
      setBookingError("Network error");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><MusicBackgroundUnified /><GlassyCard>Loading...</GlassyCard></div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <MusicBackgroundUnified />
      <GlassyCard>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaUsers className="text-blue-600" /> Browse Artists</h2>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <input
          type="text"
          placeholder="Search by name or genre"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArtists.length === 0 && <div className="text-gray-500">No artists found.</div>}
          {filteredArtists.map(artist => (
            <div key={artist.id} className="border rounded p-4 flex flex-col items-center">
              <div className="font-semibold text-lg">{artist.name}</div>
              <div className="text-gray-600">{artist.genre}</div>
              <button
                className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                onClick={() => handleBookClick(artist.id)}
              >
                Book
              </button>
              {bookingId === artist.id && (
                <form onSubmit={e => handleBookingSubmit(e, artist.id)} className="w-full mt-2 space-y-2">
                  <input
                    type="date"
                    value={bookingForm.event_date}
                    onChange={e => setBookingForm(f => ({ ...f, event_date: e.target.value }))}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={bookingForm.price}
                    onChange={e => setBookingForm(f => ({ ...f, price: e.target.value }))}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                  <textarea
                    placeholder="Message"
                    value={bookingForm.message}
                    onChange={e => setBookingForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full border px-3 py-2 rounded"
                    rows={2}
                    required
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Send</button>
                    <button type="button" onClick={() => setBookingId(null)} className="text-gray-600">Cancel</button>
                  </div>
                  {bookingSuccess && <div className="text-green-600 text-sm">{bookingSuccess}</div>}
                  {bookingError && <div className="text-red-500 text-sm">{bookingError}</div>}
                </form>
              )}
            </div>
          ))}
        </div>
        <button onClick={() => navigate('/dashboard')} className="mt-4 text-blue-600 hover:underline">Back to Dashboard</button>
      </GlassyCard>
    </div>
  );
}

function GlassyCard({ children, className = "" }) {
  return (
    <div className={`bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-auto ${className}`}>
      {children}
    </div>
  );
}

// Edit Profile Page
function ArtistProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ bio: '', genres: '', media_links: '', pricing_info: '' });
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); // New loading state for upload
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    const payload = parseJwt(token);
    const artistId = payload.sub?.id || payload.id || payload.sub;
    fetch(`http://localhost:5000/api/artists/${artistId}`)
      .then(res => res.json())
      .then(data => {
        if (data.artist) {
          setProfile({
            bio: data.artist.bio || '',
            genres: data.artist.genres || '',
            media_links: data.artist.media_links || '',
            pricing_info: data.artist.pricing_info || ''
          });
          setProfilePicUrl(data.artist.profile_pic_url || null);
          setPreview(data.artist.profile_pic_url || null);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploading(true);
    const token = localStorage.getItem('token');
    let newProfilePicUrl = profilePicUrl;
    if (selectedFile) {
      const formData = new FormData();
      formData.append('picture', selectedFile);
      try {
        const res = await axios.post('http://localhost:5000/api/profile/picture', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        });
        newProfilePicUrl = res.data.profile_pic_url;
        setProfilePicUrl(newProfilePicUrl);
        setPreview(newProfilePicUrl);
        // Re-fetch profile to ensure state is in sync with backend
        const payload = parseJwt(token);
        const artistId = payload.sub?.id || payload.id || payload.sub;
        await fetch(`http://localhost:5000/api/artists/${artistId}`)
          .then(res => res.json())
          .then(data => {
            if (data.artist) {
              setProfilePicUrl(data.artist.profile_pic_url || null);
              setPreview(data.artist.profile_pic_url || null);
            }
          });
        setSelectedFile(null);
      } catch (err) {
        setError('Failed to upload profile picture.');
        setUploading(false);
        return;
      }
    }
    // Save the rest of the profile
    try {
      const res = await fetch('http://localhost:5000/artist/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Profile updated successfully!');
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch {
      setError('Network error');
    }
    setUploading(false);
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><MusicBackgroundUnified /><GlassyCard>Loading...</GlassyCard></div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <MusicBackgroundUnified />
      <GlassyCard>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaUser className="text-blue-600" /> Edit Artist Profile</h2>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
        {uploading && <div className="text-blue-600 text-sm mb-2">Uploading...</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center mb-4">
            {(() => {
              const isBlob = preview && preview.startsWith('blob:');
              return (
                <img
                  src={preview ? (isBlob ? preview : `http://localhost:5000${preview}?t=${Date.now()}`) : "/default-avatar.png"}
                  alt="Profile Preview"
                  className="rounded-full w-32 h-32 object-cover border-4 border-white shadow mb-2"
                />
              );
            })()}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <textarea
            name="bio"
            placeholder="Bio"
            value={profile.bio}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            rows={3}
          />
          <input
            name="genres"
            placeholder="Genres (comma separated)"
            value={profile.genres}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="media_links"
            placeholder="Media Links (comma separated)"
            value={profile.media_links}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="pricing_info"
            placeholder="Pricing Info"
            value={profile.pricing_info}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save</button>
        </form>
        <button onClick={() => navigate('/dashboard')} className="mt-4 text-blue-600 hover:underline">Back to Dashboard</button>
      </GlassyCard>
    </div>
  );
}

function ProfilePictureUpload({ currentPicUrl, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(currentPicUrl);

  useEffect(() => {
    setPreview(currentPicUrl);
  }, [currentPicUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append('picture', selectedFile);
    const res = await axios.post('http://localhost:5000/api/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });
    onUploadSuccess(res.data.profile_pic_url);
  };

  return (
    <form className="flex flex-col items-center gap-2" onSubmit={handleUpload}>
      <img
        src={preview || "/default-avatar.png"}
        alt="Profile Preview"
        className="rounded-full w-24 h-24 object-cover border-4 border-white shadow mb-2"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-2"
      />
      <button
        type="submit"
        className="px-4 py-1 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
      >
        Upload
      </button>
    </form>
  );
}

function ArtistAvailability() {
  const navigate = useNavigate();
  const [availability, setAvailability] = useState([]);
  const [date, setDate] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    // Decode JWT to get artist id
    const payload = parseJwt(token);
    const artistId = payload?.sub || payload?.id || payload;
    fetch(`http://localhost:5000/artist/${artistId}/availability`)
      .then(res => res.json())
      .then(data => {
        setAvailability(data.availability || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/artist/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ date, is_available: isAvailable })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Availability updated!");
        // Refresh availability list
        const payload = parseJwt(token);
        const artistId = payload?.sub || payload?.id || payload;
        fetch(`http://localhost:5000/artist/${artistId}/availability`)
          .then(res => res.json())
          .then(data => setAvailability(data.availability || []));
      } else {
        setError(data.message || "Failed to update availability");
      }
    } catch {
      setError("Network error");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><MusicBackgroundUnified /><GlassyCard>Loading...</GlassyCard></div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <MusicBackgroundUnified />
      <GlassyCard>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaCalendarAlt className="text-blue-600" /> Manage Availability</h2>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <select
            value={isAvailable ? "yes" : "no"}
            onChange={e => setIsAvailable(e.target.value === "yes")}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="yes">Available</option>
            <option value="no">Not Available</option>
          </select>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Update Availability</button>
        </form>
        <h3 className="text-lg font-semibold mb-2">Your Availability</h3>
        <ul className="space-y-1 max-h-48 overflow-y-auto">
          {availability.length === 0 && <li className="text-gray-500">No availability set.</li>}
          {availability.map((a, i) => (
            <li key={i} className="flex justify-between border-b py-1">
              <span>{a.date}</span>
              <span className={a.is_available ? "text-green-600" : "text-red-600"}>{a.is_available ? "Available" : "Not Available"}</span>
            </li>
          ))}
        </ul>
        <button onClick={() => navigate('/dashboard')} className="mt-4 text-blue-600 hover:underline">Back to Dashboard</button>
      </GlassyCard>
    </div>
  );
}

function ArtistBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/artist/bookings", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setBookings(data.bookings || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/artist/bookings/${bookingId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Booking status updated!");
        fetchBookings();
      } else {
        setError(data.message || "Failed to update status");
      }
    } catch {
      setError("Network error");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><MusicBackgroundUnified /><GlassyCard>Loading...</GlassyCard></div>;

  const statusOptions = [
    { value: "requested", label: "Requested", color: "bg-yellow-100 text-yellow-800" },
    { value: "confirmed", label: "Confirmed", color: "bg-green-200 text-green-800" },
    { value: "rejected", label: "Rejected", color: "bg-red-200 text-red-800" },
    { value: "completed", label: "Completed", color: "bg-purple-200 text-purple-800" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <MusicBackgroundUnified />
      <GlassyCard className="!p-0">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaUsers className="text-blue-600" /> My Bookings</h2>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
          <div className="space-y-6">
            {bookings.length === 0 && <div className="text-gray-500">No bookings found.</div>}
            {bookings.map(b => (
              <div key={b.id} className="bg-white/70 rounded-xl shadow p-5 flex flex-col md:flex-row md:items-center gap-4 border border-blue-100">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-4 items-center mb-2">
                    <span className="font-semibold text-lg text-blue-800"><FaCalendarAlt className="inline mr-1" /> {b.event_date ? b.event_date.split("T")[0] : "-"}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${statusOptions.find(opt => opt.value === b.status)?.color}`}>{b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : "Pending"}</span>
                  </div>
                  <div className="mb-1 text-blue-900"><b>Organizer:</b> {b.organizer_id}</div>
                  <div className="mb-1 text-blue-900"><b>Price:</b> ₹{b.price}</div>
                  <div className="mb-1 text-blue-900"><b>Message:</b> {b.message}</div>
                </div>
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <label className="font-semibold text-blue-700 mb-1">Update Status:</label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`px-3 py-1 rounded-full text-sm font-bold border transition ${opt.color} ${b.status === opt.value ? 'ring-2 ring-blue-400 scale-105' : 'opacity-70 hover:opacity-100 hover:scale-105'} ${updatingId === b.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={b.status === opt.value || updatingId === b.id}
                        onClick={() => handleStatusChange(b.id, opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/dashboard')} className="mt-8 text-blue-600 hover:underline">Back to Dashboard</button>
        </div>
      </GlassyCard>
    </div>
  );
}

function OrganizerBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reviewingId, setReviewingId] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [updatingId, setUpdatingId] = useState(null);

  const statusOptions = [
    { value: "requested", label: "Requested", color: "bg-yellow-100 text-yellow-800" },
    { value: "confirmed", label: "Confirmed", color: "bg-green-200 text-green-800" },
    { value: "rejected", label: "Rejected", color: "bg-red-200 text-red-800" },
    { value: "completed", label: "Completed", color: "bg-purple-200 text-purple-800" },
  ];

  const fetchBookings = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/organizer/bookings", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setBookings(data.bookings || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/artist/bookings/${bookingId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Booking status updated!");
        fetchBookings();
      } else {
        setError(data.message || "Failed to update status");
      }
    } catch {
      setError("Network error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReviewClick = (bookingId) => {
    setReviewingId(bookingId);
    setReviewForm({ rating: 5, comment: "" });
    setError("");
    setSuccess("");
  };

  const handleReviewSubmit = async (e, bookingId) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/reviews/${bookingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(reviewForm)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Review posted!");
        setReviewingId(null);
        fetchBookings();
      } else {
        setError(data.message || "Failed to post review");
      }
    } catch {
      setError("Network error");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><MusicBackgroundUnified /><GlassyCard>Loading...</GlassyCard></div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <MusicBackgroundUnified />
      <GlassyCard className="!p-0">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaUsers className="text-blue-600" /> My Bookings (Organizer)</h2>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
          <div className="space-y-6">
            {bookings.length === 0 && <div className="text-gray-500">No bookings found.</div>}
            {bookings.map(b => (
              <div key={b.id} className="bg-white/70 rounded-xl shadow p-5 flex flex-col md:flex-row md:items-center gap-4 border border-blue-100">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-4 items-center mb-2">
                    <span className="font-semibold text-lg text-blue-800"><FaCalendarAlt className="inline mr-1" /> {b.event_date ? b.event_date.split("T")[0] : "-"}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${statusOptions.find(opt => opt.value === b.status)?.color}`}>{b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : "Pending"}</span>
                  </div>
                  <div className="mb-1 text-blue-900"><b>Artist:</b> {b.artist_id}</div>
                  <div className="mb-1 text-blue-900"><b>Price:</b> ₹{b.price}</div>
                  <div className="mb-1 text-blue-900"><b>Message:</b> {b.message}</div>
                </div>
                <div className="flex flex-col gap-2 min-w-[200px]">
                  {b.status === "completed" ? (
                    reviewingId === b.id ? (
                      <form onSubmit={e => handleReviewSubmit(e, b.id)} className="space-y-2">
                        <select
                          value={reviewForm.rating}
                          onChange={e => setReviewForm(f => ({ ...f, rating: Number(e.target.value) }))}
                          className="border rounded px-2 py-1"
                          required
                        >
                          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                        <input
                          type="text"
                          placeholder="Comment"
                          value={reviewForm.comment}
                          onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                          className="border rounded px-2 py-1"
                          required
                        />
                        <button type="submit" className="bg-blue-600 text-white px-2 py-1 rounded">Submit</button>
                        <button type="button" onClick={() => setReviewingId(null)} className="ml-2 text-gray-600">Cancel</button>
                      </form>
                    ) : (
                      <button onClick={() => handleReviewClick(b.id)} className="bg-green-600 text-white px-2 py-1 rounded">Leave Review</button>
                    )
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/dashboard')} className="mt-8 text-blue-600 hover:underline">Back to Dashboard</button>
        </div>
      </GlassyCard>
    </div>
  );
}

function ArtistReviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    // Decode JWT to get artist id
    const payload = parseJwt(token);
    const artistId = payload?.sub || payload?.id || payload;
    fetch(`http://localhost:5000/reviews/artist/${artistId}`)
      .then(res => res.json())
      .then(data => {
        setReviews(data.reviews || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load reviews");
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <div className="flex items-center justify-center h-screen"><MusicBackgroundUnified /><GlassyCard>Loading...</GlassyCard></div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <MusicBackgroundUnified />
      <GlassyCard>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaStar className="text-blue-600" /> My Reviews</h2>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <ul className="space-y-4">
          {reviews.length === 0 && <li className="text-gray-500">No reviews found.</li>}
          {reviews.map((r, i) => (
            <li key={i} className="border rounded p-4">
              <div className="font-semibold">Rating: {r.rating} / 5</div>
              <div className="text-gray-700 mb-2">{r.comment}</div>
              <div className="text-sm text-gray-500">By: {r.by}</div>
            </li>
          ))}
        </ul>
        <button onClick={() => navigate('/dashboard')} className="mt-4 text-blue-600 hover:underline">Back to Dashboard</button>
      </GlassyCard>
    </div>
  );
}

function OrganizerReviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    // Decode JWT to get organizer id
    const payload = parseJwt(token);
    const organizerId = payload?.sub || payload?.id || payload;
    fetch(`http://localhost:5000/reviews/organizer/${organizerId}`)
      .then(res => res.json())
      .then(data => {
        setReviews(data.reviews || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load reviews");
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <div className="flex items-center justify-center h-screen"><MusicBackgroundUnified /><GlassyCard>Loading...</GlassyCard></div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <MusicBackgroundUnified />
      <GlassyCard>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaStar className="text-blue-600" /> My Reviews (Organizer)</h2>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <ul className="space-y-4">
          {reviews.length === 0 && <li className="text-gray-500">No reviews found.</li>}
          {reviews.map((r, i) => (
            <li key={i} className="border rounded p-4">
              <div className="font-semibold">Rating: {r.rating} / 5</div>
              <div className="text-gray-700 mb-2">{r.comment}</div>
              <div className="text-sm text-gray-500">For Artist: {r.artist}</div>
            </li>
          ))}
        </ul>
        <button onClick={() => navigate('/dashboard')} className="mt-4 text-blue-600 hover:underline">Back to Dashboard</button>
      </GlassyCard>
    </div>
  );
}

function ArtistAnnouncements() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ title: "", content: "" });

  const fetchAnnouncements = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/announcements/my", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setAnnouncements(data.announcements || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Announcement posted!");
        setForm({ title: "", content: "" });
        fetchAnnouncements();
      } else {
        setError(data.message || "Failed to post announcement");
      }
    } catch {
      setError("Network error");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><MusicBackgroundUnified /><GlassyCard>Loading...</GlassyCard></div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <MusicBackgroundUnified />
      <GlassyCard>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaBullhorn className="text-blue-600" /> My Announcements</h2>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-2 mb-6">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <textarea
            placeholder="Content"
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            className="w-full border px-3 py-2 rounded"
            rows={3}
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Post Announcement</button>
        </form>
        <ul className="space-y-4">
          {announcements.length === 0 && <li className="text-gray-500">No announcements found.</li>}
          {announcements.map((a, i) => (
            <li key={i} className="border rounded p-4">
              <div className="font-semibold text-lg">{a.title}</div>
              <div className="text-gray-700 mb-2">{a.content}</div>
              <div className="text-sm text-gray-500">{a.created_at}</div>
            </li>
          ))}
        </ul>
        <button onClick={() => navigate('/dashboard')} className="mt-4 text-blue-600 hover:underline">Back to Dashboard</button>
      </GlassyCard>
    </div>
  );
}

function PublicAnnouncements() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/announcements")
      .then(res => res.json())
      .then(data => {
        setAnnouncements(data.announcements || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load announcements");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen"><MusicBackgroundUnified /><GlassyCard>Loading...</GlassyCard></div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <MusicBackgroundUnified />
      <GlassyCard>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaBullhorn className="text-blue-600" /> All Announcements</h2>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <ul className="space-y-4">
          {announcements.length === 0 && <li className="text-gray-500">No announcements found.</li>}
          {announcements.map((a, i) => (
            <li key={i} className="border rounded p-4">
              <div className="font-semibold text-lg">{a.title}</div>
              <div className="text-gray-700 mb-2">{a.content}</div>
              <div className="text-sm text-gray-500">By: {a.artist_name} | {a.created_at}</div>
            </li>
          ))}
        </ul>
        <button onClick={() => navigate('/dashboard')} className="mt-4 text-blue-600 hover:underline">Back to Dashboard</button>
      </GlassyCard>
    </div>
  );
}

function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetch("http://localhost:5000/notifications", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setNotifications(data.notifications || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load notifications");
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <div className="flex items-center justify-center h-screen"><MusicBackgroundUnified /><GlassyCard>Loading...</GlassyCard></div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <MusicBackgroundUnified />
      <GlassyCard>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaBell className="text-blue-600" /> Notifications</h2>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <ul className="space-y-4">
          {notifications.length === 0 && <li className="text-gray-500">No notifications found.</li>}
          {notifications.map((n, i) => (
            <li key={n.id || i} className={`border rounded p-4 ${n.is_read ? 'bg-gray-100' : 'bg-blue-50'}`}>
              <div className="text-gray-800">{n.content}</div>
              <div className="text-sm text-gray-500">{n.created_at}</div>
            </li>
          ))}
        </ul>
        <button onClick={() => navigate('/dashboard')} className="mt-4 text-blue-600 hover:underline">Back to Dashboard</button>
      </GlassyCard>
    </div>
  );
}

function OrganizerProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ bio: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    const payload = parseJwt(token);
    const organizerId = payload.sub?.id || payload.id || payload.sub;
    fetch(`http://localhost:5000/api/organizers/${organizerId}`)
      .then(res => res.json())
      .then(data => {
        if (data.organizer) {
          setProfile({ bio: data.organizer.bio || "" });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/organizer/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Profile updated successfully!");
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch {
      setError("Network error");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><MusicBackgroundUnified /><GlassyCard>Loading...</GlassyCard></div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <MusicBackgroundUnified />
      <GlassyCard>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaUser className="text-blue-600" /> Edit Organizer Profile</h2>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            name="bio"
            placeholder="Bio"
            value={profile.bio}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            rows={3}
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save</button>
        </form>
        <button onClick={() => navigate('/dashboard')} className="mt-4 text-blue-600 hover:underline">Back to Dashboard</button>
      </GlassyCard>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/artists" element={<ArtistList />} />
        <Route path="/artist/profile" element={<ArtistProfile />} />
        <Route path="/artist/availability" element={<ArtistAvailability />} />
        <Route path="/artist/bookings" element={<ArtistBookings />} />
        <Route path="/organizer/bookings" element={<OrganizerBookings />} />
        <Route path="/artist/reviews" element={<ArtistReviews />} />
        <Route path="/organizer/reviews" element={<OrganizerReviews />} />
        <Route path="/artist/announcements" element={<ArtistAnnouncements />} />
        <Route path="/announcements" element={<PublicAnnouncements />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/organizer/profile" element={<OrganizerProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
