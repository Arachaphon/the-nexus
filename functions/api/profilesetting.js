export async function onRequestGet(context) {
  const { env,request } = context;
  const db = env.DB;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('id');

  if (!userId) {
    return new Response(JSON.stringify({error: "Missing user ID"}),{status:400});
  }

  try {
    const user = await db.prepare("SELECT username, email FROM profiles WHERE id = ?")
      .bind(userId)
      .first();

    return new Response(JSON.stringify(user), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  const { env, request } = context;
  const db = env.DB;

  try {
    const { name, email, userId } = await request.json();
    await db.prepare("UPDATE profiles SET username = ?, email = ? WHERE id = ?")
      .bind(name, email, userId)
      .run();

    return new Response(JSON.stringify({ success: true }), { 
      status: 200, 
      headers: { "Content-Type" : "application/json"}
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}