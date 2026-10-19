// fake data for now, will hook up to real api later

export type Deploy = {
  id: string;
  status: "ready" | "failed" | "building";
  commit: string;
  branch: string;
  createdAt: number;
  duration?: number;
};

export type Project = {
  id: string;
  name: string;
  url: string;
  up: boolean;
  deploys: Deploy[];
};

const min = 60 * 1000;
const now = Date.now();

export const projects: Project[] = [
  {
    id: "p1",
    name: "portfolio",
    url: "https://portfolio.deplo.app",
    up: true,
    deploys: [
      { id: "d1", status: "ready", commit: "fix navbar on mobile", branch: "main", createdAt: now - 12 * min, duration: 48 },
      { id: "d2", status: "ready", commit: "add projects section", branch: "main", createdAt: now - 26 * 60 * min, duration: 51 },
    ],
  },
  {
    id: "p2",
    name: "shop-api",
    url: "https://shop-api.deplo.app",
    up: false,
    deploys: [
      { id: "d3", status: "failed", commit: "bump prisma", branch: "main", createdAt: now - 40 * min, duration: 33 },
      { id: "d4", status: "ready", commit: "orders endpoint", branch: "main", createdAt: now - 3 * 60 * min, duration: 70 },
    ],
  },
  {
    id: "p3",
    name: "blog",
    url: "https://blog.deplo.app",
    up: true,
    deploys: [
      { id: "d5", status: "building", commit: "new post", branch: "main", createdAt: now - 1 * min },
      { id: "d6", status: "ready", commit: "dark mode", branch: "main", createdAt: now - 2 * 24 * 60 * min, duration: 39 },
    ],
  },
];

export function timeAgo(t: number) {
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return Math.floor(s / 60) + "m ago";
  if (s < 86400) return Math.floor(s / 3600) + "h ago";
  return Math.floor(s / 86400) + "d ago";
}

export function statusIcon(s: string) {
  if (s == "ready") return "✅";
  if (s == "failed") return "❌";
  return "⏳";
}
