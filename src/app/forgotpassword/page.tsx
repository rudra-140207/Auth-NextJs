"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/forgotpassword", { email });
      console.log("email send success", response.data);
      toast.success("Reset Password Link sent to your email");
      router.push("/login");
    } catch (error: any) {
      console.log("email sending failed", error);
      const message = error.response?.data?.error || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(!email);
  }, [email]);

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex"
      style={{ backgroundImage: "url('/track.jpg')" }}
    >
      {/* Left Side Content */}
      <div className="hidden md:flex flex-col justify-center w-1/2 px-10 text-white ">
        <h1 className="text-4xl font-bold mb-4">Welcome to Auth App</h1>
        <p className="text-lg">Empower your experience.</p>
      </div>

      {/* Right Side Card */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6">
        <Card className="w-full bg-gray-300 max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-semibold">
              {loading ? "Processing..." : "Forgot Password"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              onClick={onSubmit}
              disabled={buttonDisabled || loading}
              className="w-full"
              variant="destructive"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
