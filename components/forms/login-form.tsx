"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export function LoginForm() {
  const handleSignIn = async () => {
    try {
      await signIn("google", {
        callbackUrl: "/",
        redirect: false,
      });
    } catch (error) {
      console.log(error);

      toast({
        title: "Sign-in Failed",
        description:
          error instanceof Error ? error.message : "Try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-6">
            <div className="space-y-2.5">
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>Easy way to get started!</CardDescription>
            </div>
            <Image
              src="/logo.png"
              alt="Logo"
              width={80}
              height={80}
              className="rounded-lg object-contain"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button
              variant="outline"
              className="w-full hover:bg-purple-500"
              onClick={() => handleSignIn()}
            >
              Login with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
