export async function onRequestPost(context) {
  const { env, request } = context;
  const db = env.DB;

  try {
    const { userId, currentPassword, newPassword } = await request.json();

    // 1. ตรวจสอบรหัสผ่านปัจจุบันก่อน
    const user = await db.prepare("SELECT password FROM profiles WHERE id = ?")
      .bind(userId)
      .first();

    if (!user || user.password !== currentPassword) {
      return new Response(JSON.stringify({ error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. อัปเดตรหัสผ่านใหม่
    await db.prepare("UPDATE profiles SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .bind(newPassword, userId)
      .run();

    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}