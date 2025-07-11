import { NextRequest, NextResponse } from "next/server";

export default function Middleware(req: NextRequest) {
    const LoggedIn = req.cookies.has('token');

    const { pathname } = req.nextUrl;

    // login user auth
    if(LoggedIn && pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    if(!LoggedIn && pathname === '/dashboard') {
      return NextResponse.redirect(new URL('/authentication/login', req.url));
    }
    // if not logged in 
    if(!LoggedIn && pathname === '/ ') {
       return NextResponse.redirect(new URL('/authentication/login', req.url));
    } 
    

    // gumagana
    if (!LoggedIn && pathname === '/') {
        return NextResponse.redirect(new URL('/authentication/login', req.url));
    }


    if (LoggedIn && pathname === '/authentication/login') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }
}

export const config = {
    matcher: '/((?!api|static|.\\..|_next).*)',
};