import { NextResponse } from "next/server";

export const config = {
  matcher: "/integrations/:path*",
};

export function middleware(request) {
  const requestHeaders = new Headers(request.headers);

  // Set custom headers for title and description
  requestHeaders.set("x-site-title", "The Bookshelves");
  requestHeaders.set("x-site-description", "Sip, read, and connect with us today!");

  // Replace the URL with your own domain
  request.nextUrl.href = `https://www.thebookshelves.xyz/${request.nextUrl.pathname}`;

  return NextResponse.rewrite(request.nextUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}