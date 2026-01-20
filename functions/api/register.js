export async function onRequestPost(context) {
  const { env, request } = context;
  const db = env.DB;

  // กำหนด Headers ให้รองรับ CORS จาก Docker ของคุณ
  const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // 1. ตอบกลับคำขอ OPTIONS ทันที (สำคัญมากสำหรับ Docker)
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const data = await request.json();
    const { username, email, password, phone_number = "" } = data;

    if (!username?.trim() || !email?.trim() || !password) {
      return new Response(JSON.stringify({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" }), { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    if (!db) throw new Error("Database binding 'DB' not found");

    const userId = crypto.randomUUID();
    await db.prepare(
      "INSERT INTO profiles (id, username, phone_number, email, password, role) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(userId, username.trim(), phone_number, email.trim(), password, 'owner')
    .run();

    return new Response(JSON.stringify({ 
      success: true, 
      message: "ลงทะเบียนสำเร็จ", 
      userId 
    }), { 
      status: 201, 
      headers: corsHeaders 
    });

  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { 
      status: 500, 
      headers: corsHeaders 
    });
  }
}