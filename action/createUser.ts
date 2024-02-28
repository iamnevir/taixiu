import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function createUser(userId: string) {
  if (!userId) {
    return;
  }
  try {
    const currentUser = await convex.query(api.user.getUserByUser, { userId });

    if (!currentUser) {
      await convex.mutation(api.user.create, {
        userId,
        username: "",
        coin: 1000000,
      });
    }
  } catch (error) {
    console.log(error);
  }
}
