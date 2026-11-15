const express = require("express")
const cors = require("cors")
const db = require("./data")

const app = express()
app.use(cors())
app.use(express.json())

// push tokens from phones
let devices = []

async function sendPush(title, body, url) {
  if (devices.length == 0) return
  const msgs = devices.map((to) => ({ to, title, body, sound: "default", data: { url } }))
  try {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msgs),
    })
  } catch (e) {
    console.log("push failed", e.message)
  }
}

app.post("/devices", (req, res) => {
  const token = req.body.token
  if (token && !devices.includes(token)) devices.push(token)
  res.json({ ok: true })
})

function deploysFor(projectId) {
  return db.deploys.filter((d) => d.projectId == projectId).sort((a, b) => b.createdAt - a.createdAt)
}

app.get("/projects", (req, res) => {
  res.json(db.projects.map((p) => ({ ...p, deploys: deploysFor(p.id) })))
})

app.get("/projects/:id", (req, res) => {
  const p = db.projects.find((x) => x.id == req.params.id)
  if (!p) return res.status(404).json({ error: "not found" })
  res.json({ ...p, deploys: deploysFor(p.id) })
})

app.get("/deploys/:id", (req, res) => {
  const d = db.deploys.find((x) => x.id == req.params.id)
  if (!d) return res.status(404).json({ error: "not found" })
  const p = db.projects.find((x) => x.id == d.projectId)
  const current = deploysFor(p.id)[0]
  res.json({ ...d, projectName: p.name, isCurrent: current.id == d.id })
})

app.get("/deploys/:id/logs", (req, res) => {
  const d = db.deploys.find((x) => x.id == req.params.id)
  if (!d) return res.status(404).json({ error: "not found" })
  res.json({ lines: db.getLogs(d).slice(-200) })
})

// retry and redeploy both make a new build
app.post("/deploys/:id/redeploy", (req, res) => {
  const d = db.deploys.find((x) => x.id == req.params.id)
  if (!d) return res.status(404).json({ error: "not found" })
  const nd = { id: "d" + Date.now(), projectId: d.projectId, status: "building", commit: d.commit, branch: d.branch, createdAt: Date.now() }
  db.deploys.push(nd)

  // pretend the build takes 20s
  setTimeout(() => {
    nd.status = "ready"
    nd.duration = 20
    const p = db.projects.find((x) => x.id == nd.projectId)
    if (p) p.up = true
    sendPush("Deploy finished", (p ? p.name : "") + " · " + nd.commit, "/deploy/" + nd.id)
  }, 20000)

  res.json(nd)
})

app.post("/deploys/:id/rollback", (req, res) => {
  const d = db.deploys.find((x) => x.id == req.params.id)
  if (!d || d.status != "ready") return res.status(400).json({ error: "cant roll back to this" })
  d.createdAt = Date.now() // hacky, makes it the current one
  const p = db.projects.find((x) => x.id == d.projectId)
  if (p) p.up = true
  res.json(d)
})

// uptime check every minute
async function checkSites() {
  for (const p of db.projects) {
    try {
      const r = await fetch(p.url, { method: "HEAD", signal: AbortSignal.timeout(5000) })
      if (p.up && !r.ok) sendPush(p.name + " is down", p.url + " returned " + r.status, "/project/" + p.id)
      p.up = r.ok
    } catch (e) {
      // fake domains wont resolve, so keep whatever it was
    }
  }
}
setInterval(checkSites, 60 * 1000)

const port = process.env.PORT || 4000
app.listen(port, () => console.log("server running on " + port))
