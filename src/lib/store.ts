// مخزن طلبات التواصل.
// الإنتاج: Redis المشترك (lib/kv). التطوير المحلي بدونه: ملف JSON في data/ (لا يعمل على serverless).
import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { kvEnabled, redis } from "./kv";
import type { Lead } from "./lead";

export type { Lead };

const LEADS_KEY = "athar:leads";
const MAX_LEADS = 5000;
const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

async function readFileLeads(): Promise<Lead[]> {
  try {
    return JSON.parse(await fs.readFile(LEADS_FILE, "utf-8")) as Lead[];
  } catch {
    return [];
  }
}

export async function getLeads(): Promise<Lead[]> {
  if (kvEnabled) {
    const raw = await redis<string[]>("LRANGE", LEADS_KEY, 0, MAX_LEADS - 1);
    return raw.flatMap((item) => {
      try {
        return [JSON.parse(item) as Lead];
      } catch {
        return [];
      }
    });
  }
  return readFileLeads();
}

export async function addLead(lead: Lead): Promise<void> {
  if (kvEnabled) {
    await redis("LPUSH", LEADS_KEY, JSON.stringify(lead));
    await redis("LTRIM", LEADS_KEY, 0, MAX_LEADS - 1);
    return;
  }
  const leads = await readFileLeads();
  leads.unshift(lead);
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads.slice(0, MAX_LEADS), null, 2), "utf-8");
}

/** أين تُحفظ الطلبات؟ يظهر في لوحة التحكم. */
export const storageMode: "redis" | "file" = kvEnabled ? "redis" : "file";
