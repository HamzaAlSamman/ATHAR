// مخزن JSON بسيط على نظام الملفات لحفظ الطلبات (leads) دون قاعدة بيانات.
// مناسب للتطوير والاستضافة الذاتية. على بيئات serverless للقراءة فقط يُكتفى بالتسجيل في السجل.
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  details: string;
  source: string;
  lang: string;
  createdAt: string;
}

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown): Promise<void> {
  await ensureDir();
  await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf-8");
}

export async function getLeads(): Promise<Lead[]> {
  return readJson<Lead[]>("leads.json", []);
}

export async function addLead(lead: Lead): Promise<void> {
  const leads = await getLeads();
  leads.unshift(lead);
  await writeJson("leads.json", leads);
}
