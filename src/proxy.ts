import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/login', '/sso-callback']);

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();

    // If looged in
    if (userId && isPublicRoute(req)) {
        return NextResponse.redirect(new URL('/', req.url));
    }
    // If not logged in
    if (!userId && !isPublicRoute(req)) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
});

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js|jpe?g|png|gif|svg|ico|woff2?|ttf|map)).*)",
        "/(api|trpc)(.*)",
    ],
};