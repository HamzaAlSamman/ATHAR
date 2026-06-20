import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getLeads } from "@/lib/store";
import { ADMIN_COOKIE } from "../login/route";

export const dynamic = "force-dynamic";

async function isAuthed(): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === expected;
}

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const leads = await getLeads();
  return NextResponse.json({ ok: true, leads });
}
