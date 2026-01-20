export async function onRequestPost(context) {
  const { env } = context;
  const db = env.DB;
  const { email } = await context.request.json();

  try {
    const user = await db.prepare("SELECT email FROM profiles WHERE email = ?")
      .bind(email)
      .first();

    if (!user) {
      return new Response(JSON.stringify({ message: "ไม่พบอีเมลนี้ในระบบ" }), { status: 404 });
    }

    // ในระบบจริง: สร้าง Token และส่งอีเมลที่นี่
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}