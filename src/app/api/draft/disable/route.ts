import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

/** Turns off the visual-preview draft mode and returns to the homepage. */
export async function GET(request: Request) {
  (await draftMode()).disable();
  return NextResponse.redirect(new URL("/", request.url));
}
