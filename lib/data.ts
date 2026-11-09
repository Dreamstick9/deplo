export type Deploy = {
  id: string;
  projectId: string;
  status: "ready" | "failed" | "building";
  commit: string;
  branch: string;
  createdAt: number;
  duration?: number;
  projectName?: string;
  isCurrent?: boolean;
};

export type Project = {
  id: string;
  name: string;
  url: string;
  up: boolean;
  deploys: Deploy[];
};

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
