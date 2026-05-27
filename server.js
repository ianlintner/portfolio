const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, "dist");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
  ".md": "text/markdown",
  ".xml": "application/xml",
};

const server = http.createServer((req, res) => {
  // 1. Health check for Kubernetes probes
  if (req.url === "/api/health" || req.url === "/api/health/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }),
    );
    return;
  }

  // 2. Prevent directory traversal attacks
  let safeUrl = req.url.split("?")[0];
  let filePath = path.join(DIST_DIR, safeUrl);

  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Forbidden");
    return;
  }

  // 3. Resolve directory index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  // 4. Resolve extensionless paths for clean Astro URLs (e.g. /about -> /about.html)
  if (!fs.existsSync(filePath) && !path.extname(filePath)) {
    const htmlPath = filePath + ".html";
    if (fs.existsSync(htmlPath)) {
      filePath = htmlPath;
    }
  }

  // 5. Check if file exists and serve
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    // 404 fallback to Astro's custom 404 page
    const error404Path = path.join(DIST_DIR, "404.html");
    if (fs.existsSync(error404Path)) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      fs.createReadStream(error404Path).pipe(res);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
    }
    return;
  }

  // Serve file with correct content-type
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": contentType });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Static server running at http://0.0.0.0:${PORT}`);
});
