import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL; // your FastAPI server
  const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: "POST",
    headers: {
            'accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
    body: formData.toString(),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const data = await response.json();

  // Create response
  const res = NextResponse.json({ success: true });

  // Store access token securely in HttpOnly cookie
  res.cookies.set("access_token", data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  // Optional: store lightweight info for client-side
  res.cookies.set("mutable_access_token", data.access_token, {path: "/"});
  res.cookies.set("signedIn", "true", { path: "/" });
  res.cookies.set("user", username, { path: "/" });
  res.cookies.set("userId", data.user_id, { path: "/" });
  res.cookies.set("profilePicture", data.profile_picture ?? "/blankProfile.png", { path: "/" });

  return res;
}
