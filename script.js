const rssUrl = "https://api.io.canada.ca/io-server/gc/news/en/v2?dept=departmentofcitizenshipandimmigration&sort=publishedDate&orderBy=desc&publishedDate%3E=2021-07-23&pick=50&format=atom";

async function fetchFeed() {
  try {
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`);
    const data = await response.json();
    const parser = new DOMParser();
    const xml = parser.parseFromString(data.contents, "application/xml");
    const entries = xml.querySelectorAll("entry");

    const container = document.getElementById("tiles-container");
    container.innerHTML = "";

    entries.forEach((entry, index) => {
      if (index >= 12) return; // limit to 12 tiles
      const title = entry.querySelector("title")?.textContent;
      const link = entry.querySelector("link")?.getAttribute("href");
      const published = entry.querySelector("published")?.textContent;

      const tile = document.createElement("div");
      tile.className = "tile";

      tile.innerHTML = `
        <h2><a href="${link}" target="_blank">${title}</a></h2>
        <time>Published: ${new Date(published).toLocaleString()}</time>
      `;

      container.appendChild(tile);
    });
  } catch (err) {
    document.getElementById("tiles-container").innerText = "Failed to load feed.";
    console.error("Error fetching feed:", err);
  }
}

fetchFeed();
setInterval(fetchFeed, 10 * 60 * 1000); // refresh every 10 min
