import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { CircleParking } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1>Welcome to Learn English AI 2</h1>
      <Button variant="outline">Login</Button>

      <UserButton></UserButton>
    </div>
  );
}
