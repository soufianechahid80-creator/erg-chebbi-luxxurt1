import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { createActivityLog } from "@/lib/admin-data";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = getAdminSession();
  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url), { status: 302 });
  }

  const formData = await request.formData();
  const status = String(formData.get("status") || "");
  const note = String(formData.get("note") || "");

  const allowed = ["new", "pending", "confirmed", "cancelled"];
  if (!allowed.includes(status)) {
    return NextResponse.redirect(new URL("/admin/bookings", request.url), { status: 302 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.redirect(new URL("/admin/bookings", request.url), { status: 302 });
  }

  const previous = await supabase
    .from("booking_requests")
    .select("status, booking_status, full_name, experience_title")
    .eq("id", params.id)
    .maybeSingle();

  await supabase
    .from("booking_requests")
    .update({ status, booking_status: status })
    .eq("id", params.id);

  await supabase.from("booking_status_history").insert({
    booking_id: params.id,
    previous_status: previous.data?.booking_status || previous.data?.status || null,
    new_status: status,
    changed_by: session.sub,
    note: note || null
  });

  await createActivityLog({
    activityType: "booking_status_updated",
    entityType: "booking",
    entityId: params.id,
    message: `Booking status updated to ${status} for ${previous.data?.full_name || "guest"}.`,
    metadata: { note }
  });

  return NextResponse.redirect(new URL("/admin/bookings", request.url), { status: 302 });
}
