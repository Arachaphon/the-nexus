export async function onRequestPost(context) {
  const { env, request } = context;
  const db = env.DB;

  try {
    const data = await request.json();
    const username = data.username;
    const password = data.password;

    if (!db) { return new Response(JSON.stringify({ message: "DB Binding Error" }), { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    const user = await db.prepare("SELECT * FROM profiles WHERE username = ? OR email = ?")
      .bind(username, username)
      .first();
    
    if (!user) {
      return new Response(JSON.stringify({ success: false, message: "ไม่พบชื่อผู้ใช้นี้" }), { 
        status: 401, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    if (!user || user.password !== password) {
      return new Response(JSON.stringify({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" }), { 
        status: 401, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      user: { id: user.id, username: user.username } 
    }), { status: 200, headers: { "Content-Type": "application/json" } });

  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
}