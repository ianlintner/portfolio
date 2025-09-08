/* Wait for TCP host:port to accept connections. Usage: node wait-for-db.js host port [retries] */
const net = require("net");

const host = process.argv[2] || "127.0.0.1";
const port = parseInt(process.argv[3] || "5432", 10);
const max = parseInt(process.argv[4] || "60", 10);

let attempt = 0;
function tryConnect() {
  const socket = net.connect({ host, port });
  socket.on("connect", () => {
    console.log(`DB is accepting connections at ${host}:${port}`);
    socket.end();
    process.exit(0);
  });
  socket.on("error", (err) => {
    attempt += 1;
    if (attempt >= max) {
      console.error(
        `DB not reachable at ${host}:${port} after ${max}s:`,
        err.message,
      );
      process.exit(1);
    }
    setTimeout(tryConnect, 1000);
  });
}

console.log(`Waiting for DB ${host}:${port} ...`);
tryConnect();
