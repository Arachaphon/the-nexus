export async function onRequestPost(context) {
  const { env, request } = context;
  const db = env.DB;

  try {
    // ตรวจสอบว่ามีข้อมูลส่งมาจริงหรือไม่
    const data = await request.json();

    const username = data.username?.trim();
    const email = data.email?.trim();
    const phone_number = data.phone_number || ""; // ให้ตรงกับ Key ที่ส่งมาจาก register.tsx
    const password = data.password;

    if (!username || !email || !password) {
      return new Response(JSON.stringify({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // ตรวจสอบความพร้อมของ Database Binding
    if (!db) {
      throw new Error("Database binding 'DB' not found");
    }

    const userId = crypto.randomUUID(); 
    
    await db.prepare(
      "INSERT INTO profiles (id, username, phone_number, email, password, role) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(userId, username, phone_number, email, password, 'owner')
    .run();

    return new Response(JSON.stringify({ 
      success: true, 
      message: "ลงทะเบียนสำเร็จ",
      userId 
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    // ส่ง Error กลับไปในรูปแบบ JSON เสมอเพื่อป้องกันหน้า Frontend พัง
    return new Response(JSON.stringify({ message: err.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}