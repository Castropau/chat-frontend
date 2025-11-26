import { NextRequest, NextResponse } from "next/server";

export default function Middleware(req: NextRequest) {


  // server is down


// const isServerDown = process.env.SERVER === 'FALSE';  // Check if the server is down

//   // If the server is down, redirect to a "Server Down" page
//   if (isServerDown) {
//     return NextResponse.redirect(new URL('/server-down', req.url));
//   }
const isServerDown = process.env.SERVER_DOWN === 'true';  // Check if the server is down

  // If the server is down, redirect to a "Server Down" page
  if (isServerDown) {
    const { pathname } = req.nextUrl;
    
    // If the user is already on the /server-down page, do nothing
    if (pathname !== '/server-down') {
      return NextResponse.redirect(new URL('/server-down', req.url));
    }
  } else {
    // If the server is up, redirect to /dashboard/timeline if user is on the /server-down page
    const { pathname } = req.nextUrl;
    if (pathname === '/server-down') {
      return NextResponse.redirect(new URL('/dashboard/timeline', req.url));
    }
  }
    const LoggedIn = req.cookies.has('token');

    const { pathname } = req.nextUrl;

    // login user auth
    if(LoggedIn && pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard/timeline', req.url));
    }

    


 // if not logged in 
    if(!LoggedIn && pathname === '/dashboard') {
      return NextResponse.redirect(new URL('/authentication/login', req.url));
    }
     if(!LoggedIn && pathname === '/dashboard/timeline') {
      return NextResponse.redirect(new URL('/authentication/login', req.url));
    }
   
    // if(!LoggedIn && pathname === '/ ') {
    //    return NextResponse.redirect(new URL('/authentication/login', req.url));
    // } 
    

    // gumagana
    if (!LoggedIn && pathname === '/') {
        return NextResponse.redirect(new URL('/authentication/login', req.url));
    }


    if (LoggedIn && pathname === '/authentication/login') {
        return NextResponse.redirect(new URL('/dashboard/timeline', req.url));
    }
}

export const config = {
    matcher: '/((?!api|static|.\\..|_next).*)',
};
// import { NextRequest, NextResponse } from "next/server";

// export default function Middleware(req: NextRequest) {
//   const LoggedIn = req.cookies.has("token");
//   const { pathname } = req.nextUrl;

//   // Redirect logged-in users from home or login page to dashboard
//   if (LoggedIn && (pathname === "/" || pathname === "/authentication/login")) {
//     return NextResponse.redirect(new URL("/dashboard/timeline", req.url));
//   }

//   // Redirect non-logged-in users trying to access dashboard pages
//   if (!LoggedIn && pathname.startsWith("/dashboard")) {
//     return NextResponse.redirect(new URL("/authentication/login", req.url));
//   }
//    if (!LoggedIn && pathname.startsWith("/dashboard/timeline")) {
//     return NextResponse.redirect(new URL("/authentication/login", req.url));
//   }

//   // Optionally, handle the root if not logged in
//   if (!LoggedIn && pathname === "/") {
//     return NextResponse.redirect(new URL("/authentication/login", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: "/((?!api|static|\\..*|_next).*)",
// };
