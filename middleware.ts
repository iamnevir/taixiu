import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { createUser } from "./action/createUser";
import { NextResponse } from "next/server";

export default authMiddleware({
  afterAuth(auth, req, evt) {
    const url = process.env.NEXT_PUBLIC_APP_URL;
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({
        returnBackUrl: `${url}/sign-in`,
      });
    }

    if (auth.userId) {
      createUser(auth.userId);
      return NextResponse.next();
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
