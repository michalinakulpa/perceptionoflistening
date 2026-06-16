export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Missing code");
  }

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: "https://perceptionoflistening.vercel.app/api/callback"
  });

  const response = await fetch(
    "https://accounts.spotify.com/api/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization":
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64")
      },
      body: params
    }
  );

  const data = await response.json();

  if (!data.access_token) {
    return res.status(500).json(data);
  }

  res.redirect(
    "/?token=" + data.access_token
  );
}