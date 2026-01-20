export async function onRequestPost(context) {
  const { env, request } = context;
  const db = env.DB;

  try {
    const { email, password } = await request.json();

    // ค้นหาและอัปเดตรหัสผ่าน (ในระบบจริงควร Hash รหัสผ่านก่อนเก็บ)
    const result = await db.prepare("UPDATE profiles SET password = ? WHERE email = ?")
      .bind(password, email)
      .run();

    if (result.meta.changes === 0) {
      return new Response(JSON.stringify({ message: "ไม่พบข้อมูลผู้ใช้งาน" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}