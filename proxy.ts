import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROOT_DOMAIN = "sinergimandiriperkasa.co.id";

export function proxy(request: NextRequest) {
  const hostname = (request.headers.get("host") || "").replace(":3000", "");
  const url = request.nextUrl.clone();

  if (
    hostname === `building.${ROOT_DOMAIN}` ||
    hostname.startsWith("building.localhost")
  ) {
    url.pathname = `/building${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  if (
    hostname === `AMDK.${ROOT_DOMAIN}` ||
    hostname.startsWith("AMDK.localhost")
  ) {
    url.pathname = `/AMDK${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // domain utama / www -> jalan normal, tanpa rewrite
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)"],
};
