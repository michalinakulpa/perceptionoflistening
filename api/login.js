export default function handler(req, res) {
  const scope = "user-read-currently-playing user-read-playback-state";

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope,
    redirect_uri: "https://perceptionoflistening.vercel.app/api/callback"
  });

  res.redirect("https://accounts.spotify.com/authorize?" + params.toString());
}