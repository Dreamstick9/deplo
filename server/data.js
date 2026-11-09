// in memory for now, no db yet
const min = 60 * 1000
const now = Date.now()

let projects = [
  { id: "p1", name: "portfolio", url: "https://portfolio.deplo.app", up: true },
  { id: "p2", name: "shop-api", url: "https://shop-api.deplo.app", up: false },
  { id: "p3", name: "blog", url: "https://blog.deplo.app", up: true },
]

let deploys = [
  { id: "d1", projectId: "p1", status: "ready", commit: "fix navbar on mobile", branch: "main", createdAt: now - 12 * min, duration: 48 },
  { id: "d2", projectId: "p1", status: "ready", commit: "add projects section", branch: "main", createdAt: now - 26 * 60 * min, duration: 51 },
  { id: "d3", projectId: "p2", status: "failed", commit: "bump prisma", branch: "main", createdAt: now - 40 * min, duration: 33 },
  { id: "d4", projectId: "p2", status: "ready", commit: "orders endpoint", branch: "main", createdAt: now - 3 * 60 * min, duration: 70 },
  { id: "d5", projectId: "p3", status: "building", commit: "new post", branch: "main", createdAt: now - 1 * min },
  { id: "d6", projectId: "p3", status: "ready", commit: "dark mode", branch: "main", createdAt: now - 2 * 24 * 60 * min, duration: 39 },
]

const baseLogs = [
  "Cloning repository...",
  "Installing dependencies",
  "npm install",
  "added 812 packages in 21s",
  "Running build",
  "> next build",
]

function getLogs(d) {
  if (d.status == "failed") {
    return [
      ...baseLogs,
      "warn - prisma version changed",
      "Error: Cannot find module '@prisma/client'",
      "    at Object.<anonymous> (/app/src/db.ts:1:1)",
      "ERR! build failed with exit code 1",
      "Build failed",
    ]
  }
  if (d.status == "building") return [...baseLogs, "Compiling..."]
  return [...baseLogs, "Compiled successfully", "Uploading build output", "Deployed"]
}

module.exports = { projects, deploys, getLogs }
