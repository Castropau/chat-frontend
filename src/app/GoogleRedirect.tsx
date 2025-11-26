// 'use client';

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// interface GoogleSessionUser {
//   id: string;
//   token: string;
//   email?: string | null;
//   name?: string | null;
//   image?: string | null;
// }
// interface LocalUserData {
//   id: string;
//   token: string;
//   email?: string | null;
//   name?: string | null;
//   image?: string | null;
// }

// export default function GoogleLoginRedirect() {
//   const { data: session } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (session?.user) {
//       // Store the token and id in localStorage so CreateGoal reads correct user
//       localStorage.setItem("user", JSON.stringify({
//         id: (session.user as any).id,
//         token: (session.user as any).token,
//         email: session.user?.email,
//         name: session.user?.name,
//         image: session.user?.image
//       }));
//       router.push("/dashboard/timeline"); // redirect after login
//     }
//   }, [session, router]);

//   return <p>Logging in...</p>;
// }
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface GoogleSessionUser {
  id: string;
  token: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}

// interface LocalUserData extends GoogleSessionUser {}

export default function GoogleLoginRedirect() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const user = session?.user as GoogleSessionUser | undefined;

    if (user) {
      const data: GoogleSessionUser = {
        id: user.id,
        token: user.token,
        email: user.email,
        name: user.name,
        image: user.image,
      };

      localStorage.setItem("user", JSON.stringify(data));
      router.push("/dashboard/timeline");
    }
  }, [session, router]);

  return <p>Logging in...</p>;
}
