// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });

  // Clear the HttpOnly access token
  res.cookies.set("access_token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0, // expires immediately
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
