"use client";

import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";
import axios from "axios";

function Provider({ children }) {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      CheckIsNewUser();
    }
  }, [isLoaded, user]);

  const CheckIsNewUser = async () => {
    try {
      // ✅ Serialize user data trước khi gửi
      const userData = {
        id: user.id,
        fullName: user.fullName,
        primaryEmailAddress: {
          emailAddress: user.primaryEmailAddress?.emailAddress,
        },
        imageUrl: user.imageUrl,
      };

      console.log("Sending user data:", userData); // Debug log

      const resp = await axios.post("/api/create-user", { user: userData });
      console.log("Response from create-user:", resp.data);

      if (resp.data.success) {
        console.log("User ID:", resp.data.userId);
      }
    } catch (error) {
      console.error("Error calling create-user API:", error);
    }
  };

  return <div>{children}</div>;
}

export default Provider;
