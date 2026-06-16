export default async function handler(req, res) {
  const params = new URLSearchParams();

  params.append("grant_type", "refresh_token");
  params.append(
    "refresh_token",
    process.env.SPOTIFY_REFRESH_TOKEN
  );

  const tokenResponse = await fetch(
    "https://accounts.spotify.com/api/token",
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID +
              ":" +
              process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
        "Content-Type":
          "application/x-www-form-urlencoded"
      },
      body: params
    }
  );

  const tokenData = await tokenResponse.json();

  const response = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization:
          "Bearer " + tokenData.access_token
      }
    }
  );

  if (response.status === 204) {
    return res.json({
      text: "NOW PLAYING: nothing right now"
    });
  }

  const data = await response.json();

  if (!data.item) {
    return res.json({
      text: "NOW PLAYING: nothing right now"
    });
  }

  const title = data.item.name;
  const artist = data.item.artists
    .map(a => a.name)
    .join(", ");

  return res.json({
    text: `NOW PLAYING: ${title} — ${artist}`
  });
}