export async function onRequestPost(context) {
  const { env, request } = context;
  const db = env.DB;
  const { water, electric } = await request.json();

  try {
    // บันทึกหรืออัปเดตการตั้งค่า (สมมติว่าผูกกับหอพัก ID 1)
    await db.prepare(`
      INSERT INTO utility_settings (dorm_id, water_type, water_price, water_min, elec_type, elec_price, elec_min)
      VALUES (1, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(dorm_id) DO UPDATE SET
      water_type=excluded.water_type, water_price=excluded.water_price...
    `)
    .bind(water.type, water.price, water.min, electric.type, electric.price, electric.min)
    .run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}