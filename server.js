require("dotenv").config();
const express = require("express");
const next = require("next");

const port = process.env.PORT || 3000;
const host = "0.0.0.0";
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Ensure proxy headers are trusted so redirects use real host, not 0.0.0.0
  server.set("trust proxy", true);

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, host, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${host}:${port}`);
  });
});
