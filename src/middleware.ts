import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const protectedPaths = [
    "/user/mypage", 
    "/user/demo",
    "/settings",
    "/post/new",
    "/post/edit",
];

export function middleware(request: NextRequest) {
    const username = request.cookies.get("user")?.value;
    if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
        if (username === "demo_guest") {
            // For demo user, check signedIn cookie
            const demoSignedIn = request.cookies.get("signedIn")?.value;
            if (!demoSignedIn) {
                return NextResponse.redirect(new URL("/login", request.url));
            }
            return NextResponse.next();
        }

        const accessToken = request.cookies.get("access_token")?.value;
        if (!accessToken) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        try {
            // Decode without verifying signature
            const decoded = jwt.decode(accessToken) as { 
                exp?: number; 
                [key: string]: unknown 
            };

            if (decoded?.exp) {
            const now = Math.floor(Date.now() / 1000); // current time in seconds
            
            if (decoded.exp < now) {
                // Token is expired
                console.log("Token expired");
                const response = NextResponse.redirect(new URL("/login", request.url));
                response.cookies.delete("access_token");
                response.cookies.delete("signedIn");
                response.cookies.delete("user");
                response.cookies.delete("userId");
                response.cookies.delete("profilePicture");
                return response;
            }
            }
        } catch (err) {
            console.log("Failed to decode token:", err);
        }
    }

    return NextResponse.next();
}
