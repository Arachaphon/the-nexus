// functions/api/dormitory.js
export async function onRequestPost(context) {
  const { env, request } = context;
  const db = env.DB;

  try {
    const data = await request.json();

    // บันทึกข้อมูลลงตาราง dormitories (สมมติชื่อตาราง)
    await db.prepare(`
      INSERT INTO dormitories (name, address, phone_number, tax_id, due_date, fine_per_day)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    .bind(data.name, data.address, data.phone_number, data.tax_id, data.due_date, data.fine_per_day)
    .run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}