import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getLeads, storageMode } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  try {
    const leads = await getLeads();
    return NextResponse.json({ ok: true, leads, storage: storageMode }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[admin] failed to read leads", err);
    return NextResponse.json({ ok: false, error: "storage_error" }, { status: 500 });
  }
}
