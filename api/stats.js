export default async function handler(req, res) {
  const userId = "31foq3gb5u4a5oliibv4h4lowldi";
  const artistId = "49461";

  let page = 1;
  let totalMs = 0;
  let totalStreams = 0;
  let hasMore = true;

  while (hasMore && page <= 20) {
    const response = await fetch(
      `https://api.stats.fm/api/v1/users/${userId}/streams/artists/${artistId}?page=${page}`
    );

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      hasMore = false;
      break;
    }

    for (const stream of data.items) {
      totalMs += stream.playedMs || 0;
      totalStreams += 1;
    }

    page++;
  }

  const minutes = Math.round(totalMs / 60000);

  return res.json({
    minutes,
    streams: totalStreams,
    text: `${minutes.toLocaleString("en-US")} minutes listened`
  });
}