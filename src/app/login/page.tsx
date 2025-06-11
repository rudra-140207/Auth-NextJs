"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setLoading(true);
    try {
      await axios.post("/api/users/login", user);
      toast.success("Login successful!");
      router.push("/profile");
    } catch (error: any) {
      console.error(
        "Login failed",
        error.response?.data?.error || error.message
      );
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.email && user.password));
  }, [user]);

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex"
      style={{ backgroundImage: "url('/track.jpg')" }}
    >
      {/* Left Side Content */}
      <div className="hidden md:flex flex-col justify-center w-1/2 px-10 text-white ">
        <h1 className="text-4xl font-bold mb-4">Welcome to Auth App</h1>
        <p className="text-lg">
          Empower your experience.<br/> Login to continue your
          journey.
        </p>
      </div>

      {/* Right Side Card */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6">
        <Card className="w-full bg-slate-300 max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Login to Your Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                disabled={loading}
              />
            </div>

            <Button
              variant={"destructive"}
              onClick={onLogin}
              disabled={buttonDisabled || loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging
                  in...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?
              <Link href="/signup" className="underline text-blue-600">
                Sign up
              </Link>
            </p>
            {/* <p className="text-center text-sm text-gray-600">
              Forgot your password?
              <Link href="/forgotpassword" className="underline text-blue-600">
                Reset here
              </Link>
            </p> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
