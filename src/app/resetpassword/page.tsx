"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "changed" | "error"
  >("idle");


  const handlePasswordChange = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(token.length === 0){
        toast.error("Invalid token");
        return
    }
    if (password === confirmPassword) {
      setStatus("loading");
      axios
        .post("/api/users/resetpassword", { token, password })
        .then(() => {
          setStatus("changed");
          toast.success("Password reset successfully");
        })
        .catch((error) => {
          setStatus("error");
          toast.error("Failed to reset password");
          console.error(error.response?.data || error.message);
        });
    }else{
        toast.error("Passwords do not match");
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    if (urlToken) setToken(urlToken);
  }, []);


  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex"
      style={{ backgroundImage: "url('/track.jpg')" }}
    >
      {/* Left Side Content */}
      <div className="hidden md:flex flex-col justify-center w-1/2 px-10 text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to Auth App</h1>
        <p className="text-lg">Empower your experience.</p>
      </div>

      {/* Right Side Card */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-center bg-gray-300 text-2xl">
              Reset Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
              />
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
              />
              <Button type="submit" className="w-full">
                Change Password
              </Button>
            </form>
            {status === "loading" && (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                <p>Reseting Password...</p>
              </div>
            )}

            {status === "changed" && (
              <Alert className="bg-green-100 border-green-400">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <AlertTitle>Password Reset Successful</AlertTitle>
                <AlertDescription>
                  You can now log in with your new password.
                </AlertDescription>
                <Button asChild className="mt-4 w-full">
                  <Link href="/login">Go to Login</Link>
                </Button>
              </Alert>
            )}

            {status === "error" && (
              <Alert variant="destructive">
                <XCircle className="h-5 w-5 text-red-500" />
                <AlertTitle>Password Change Failed</AlertTitle>
                <AlertDescription>
                  The token is invalid or has expired. Please try again.
                </AlertDescription>
              </Alert>
            )}

            {status === "idle" && (
              <p className="text-center text-gray-600">
                Waiting for verification...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
