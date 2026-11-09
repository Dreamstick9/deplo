import { Project, Deploy } from "./data";

// on a real phone use your laptop ip, like http://192.168.1.5:4000
export const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

async function req(path: string, method = "GET", body?: any) {
  const res = await fetch(API_URL + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "request failed");
  return data;
}

export const getProjects = (): Promise<Project[]> => req("/projects");
export const getProject = (id: string): Promise<Project> => req("/projects/" + id);
export const getDeploy = (id: string): Promise<Deploy> => req("/deploys/" + id);
export const getLogs = (id: string): Promise<{ lines: string[] }> => req("/deploys/" + id + "/logs");

export const redeploy = (id: string) => req("/deploys/" + id + "/redeploy", "POST");
export const retry = redeploy;
export const rollback = (id: string) => req("/deploys/" + id + "/rollback", "POST");
