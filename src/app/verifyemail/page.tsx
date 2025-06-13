"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "verified" | "error"
  >("idle");

  const verifyUserEmail = async () => {
    setStatus("loading");
    try {
      await axios.post("/api/users/verifyemail", { token });
      setStatus("verified");
    } catch (error: any) {
      setStatus("error");
      console.error(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    if (urlToken) setToken(urlToken);
  }, []);

  useEffect(() => {
    const runVerification = async () => {
      if (token.length > 0) {
        await verifyUserEmail();
      }
    };
    runVerification();
  }, [token]);

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
              Email Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === "loading" && (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                <p>Verifying your email...</p>
              </div>
            )}

            {status === "verified" && (
              <Alert className="bg-green-100 border-green-400">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <AlertTitle>Email Verified!</AlertTitle>
                <AlertDescription>
                  Your email has been successfully verified. You can now log in.
                </AlertDescription>
                <Button asChild className="mt-4 w-full">
                  <Link href="/login">Go to Login</Link>
                </Button>
              </Alert>
            )}

            {status === "error" && (
              <Alert variant="destructive">
                <XCircle className="h-5 w-5 text-red-500" />
                <AlertTitle>Verification Failed</AlertTitle>
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
