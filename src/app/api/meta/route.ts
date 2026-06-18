import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_id, event_url, client_user_agent } = body;

    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;

    if (!pixelId || !accessToken) {
      return NextResponse.json(
        { error: "Missing Meta credentials" },
        { status: 500 }
      );
    }

    const payload = {
      data: [
        {
          event_name: "Lead",
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_id: event_id,
          event_source_url: event_url,
          user_data: {
            client_user_agent: client_user_agent,
          },
        },
      ],
    };

    const url = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Meta Conversions API Error:", data);
      return NextResponse.json(
        { error: "Failed to send event to Meta" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error processing Meta event:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
