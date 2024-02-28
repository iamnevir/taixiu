"use client";

import TaiXiu from "@/components/taixiu";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();
  if (!user?.id) {
    return null;
  }
  return <TaiXiu user={user} />;
}
