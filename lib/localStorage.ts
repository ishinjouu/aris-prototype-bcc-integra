import { ActionFollowUp, defaultActionFollowUps } from "@/data/equipment";

const STORAGE_KEY = "aris_action_followups";

export function getActionFollowUps(): ActionFollowUp[] {
  if (typeof window === "undefined") return defaultActionFollowUps;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultActionFollowUps;
    return JSON.parse(raw) as ActionFollowUp[];
  } catch {
    return defaultActionFollowUps;
  }
}

export function saveActionFollowUps(items: ActionFollowUp[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function upsertActionFollowUp(item: ActionFollowUp): ActionFollowUp[] {
  const current = getActionFollowUps();
  const idx = current.findIndex((a) => a.id === item.id);
  const updated = idx >= 0
    ? current.map((a) => (a.id === item.id ? { ...item, updatedAt: new Date().toISOString() } : a))
    : [...current, { ...item, updatedAt: new Date().toISOString() }];
  saveActionFollowUps(updated);
  return updated;
}

export function deleteActionFollowUp(id: string): ActionFollowUp[] {
  const updated = getActionFollowUps().filter((a) => a.id !== id);
  saveActionFollowUps(updated);
  return updated;
}
