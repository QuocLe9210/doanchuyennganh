"use client";

import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";

function Provider({ children }) {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      CheckIsNewUser();
    }
  }, [isLoaded, user]);

  const CheckIsNewUser = async () => {
    try {
      const result = await db
        .select()
        .from(USER_TABLE)
        .where(eq(USER_TABLE.email, user?.primaryEmailAddress?.emailAddress));

      console.log("User check result:", result);

      if (result?.length === 0) {
        const userResp = await db
          .insert(USER_TABLE)
          .values({
            userName: user?.fullName, // ✅ Đổi từ name -> userName
            email: user?.primaryEmailAddress?.emailAddress,
            isMember: false, // ✅ Set default value
          })
          .returning({ id: USER_TABLE.id });

        console.log("New user inserted:", userResp);
      }
    } catch (error) {
      console.error("Error checking/inserting user:", error);
    }
  };

  return <div>{children}</div>;
}

export default Provider;
