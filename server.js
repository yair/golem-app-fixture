// golem-app-fixture: the smallest app that follows the golem-apps contract.
// One port from $PORT, a health path, writes only to /tmp and /data, and all
// configuration from the environment. Used to test golem's app hosting and as
// the worked example in the golem-apps skill.
const http = require("http");
const fs = require("fs");

const port = Number(process.env.PORT || 8080);
const version = process.env.VERSION || "dev";
const dataFile = "/data/visits";

function visits() {
  // /data exists only when the app declared "data": true. Without it the
  // counter just stays in memory.
  try {
    const n = Number(fs.readFileSync(dataFile, "utf8")) + 1;
    fs.writeFileSync(dataFile, String(n));
    return n;
  } catch (e) {
    if (e.code === "ENOENT") {
      try { fs.writeFileSync(dataFile, "1"); return 1; } catch (_) { /* no /data */ }
    }
    visits.memory = (visits.memory || 0) + 1;
    return visits.memory;
  }
}

http.createServer((req, res) => {
  if (req.url === "/healthz") {
    // Lets a test make exactly one release unhealthy on golem, while CI (which
    // never sets the variable) still passes it. See the skill's rollback example.
    const broken = process.env.FIXTURE_FAIL_HEALTH_VERSION === version;
    res.writeHead(broken ? 500 : 200, { "content-type": "text/plain" });
    return res.end(broken ? "deliberately unhealthy\n" : "ok\n");
  }
  if (req.url === "/") {
    const n = visits();
    const greeting = process.env.GREETING ? "set" : "not set";
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    return res.end(`<!doctype html><title>golem-app-fixture</title>
<h1>golem-app-fixture</h1>
<p>version ${version}</p><p>visits: ${n}</p><p>GREETING secret: ${greeting}</p>\n`);
  }
  res.writeHead(404, { "content-type": "text/plain" });
  res.end("not found\n");
}).listen(port, () => console.log(`golem-app-fixture ${version} listening on ${port}`));
