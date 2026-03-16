import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ success: true, skipped: true });
    }

    const body = (await request.json()) as {
      sessionId?: string;
      path?: string;
      referrer?: string;
      locale?: string;
      eventType?: string;
    };

    if (!body.sessionId || !body.path) {
      return NextResponse.json({ error: "sessionId and path are required" }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") || null;

    const existing = await supabase
      .from("visitor_sessions")
      .select("id")
      .eq("session_token", body.sessionId)
      .maybeSingle();

    let sessionRowId = existing.data?.id as string | undefined;

    if (!existing.data) {
      const inserted = await supabase
        .from("visitor_sessions")
        .insert({
          session_token: body.sessionId,
          referrer: body.referrer || null,
          landing_page: body.path,
          locale: body.locale || "en",
          user_agent: userAgent,
          source: body.eventType === "booking_submitted" ? "booking" : "website"
        })
        .select("id")
        .single();

      sessionRowId = inserted.data?.id;
    } else {
      await supabase
        .from("visitor_sessions")
        .update({
          referrer: body.referrer || null,
          locale: body.locale || "en",
          user_agent: userAgent
        })
        .eq("session_token", body.sessionId);
    }

    if (sessionRowId) {
      await supabase.from("page_events").insert({
        session_id: sessionRowId,
        page_path: body.path,
        path: body.path,
        event_type: body.eventType || "page_view",
        event_label: body.eventType === "booking_submitted" ? "booking conversion" : null,
        metadata: {
          referrer: body.referrer || null,
          locale: body.locale || "en"
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
