import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import {
  CreateNewUser,
  helloWorld,
  GenerateNotes,
} from "../../../inngest/functions";

// Serve Inngest functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld, // Test function
    CreateNewUser, // Create new user when signed up
    GenerateNotes, // Generate chapter notes with AI
  ],
});
