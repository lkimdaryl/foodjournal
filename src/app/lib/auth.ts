import { NextRequest } from "next/server";

export function isSignedIn(request: NextRequest) {
  const signedIn = request.cookies.get("signedIn")?.value;
  return signedIn === "true";
}
