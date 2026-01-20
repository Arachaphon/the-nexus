export async function onRequestPost(context) {
  const { env } = context;
  const db = env.DB;
  const { email, newPassword } = await context.request.json();

  try {
    // หมายเหตุ: ในระบบจริงควรมีการตรวจสอบ Token และ Hash รหัสผ่านก่อนบันทึก
    await db.prepare("UPDATE profiles SET password = ? WHERE email = ?")
      .bind(newPassword, email)
      .run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}