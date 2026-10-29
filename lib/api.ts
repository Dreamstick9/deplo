import { projects, Deploy } from "./data";

// fake actions, just changes the local data for now

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function findDeploy(id: string) {
  for (const p of projects) {
    const d = p.deploys.find((x) => x.id == id);
    if (d) return { project: p, deploy: d };
  }
  return null;
}

export async function redeploy(deployId: string) {
  const found = findDeploy(deployId);
  if (!found) throw new Error("deploy not found");
  await wait(600);
  const d: Deploy = {
    id: "d" + Date.now(),
    status: "building",
    commit: found.deploy.commit,
    branch: found.deploy.branch,
    createdAt: Date.now(),
  };
  found.project.deploys.unshift(d);
  return d;
}

// retry is same thing as redeploy basically
export const retry = redeploy;

export async function rollback(deployId: string) {
  const found = findDeploy(deployId);
  if (!found) throw new Error("deploy not found");
  await wait(600);
  // move this deploy to the top so it counts as current
  found.project.deploys = [found.deploy, ...found.project.deploys.filter((d) => d.id != deployId)];
  found.project.up = true;
}
