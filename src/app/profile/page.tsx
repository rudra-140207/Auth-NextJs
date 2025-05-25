"use client";

import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  _id: string;
  username: string;
  email: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const getUserDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/users/me");
      toast.success("User data fetched successfully");
      setUser(res.data.data);
    } catch (error: any) {
      toast.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

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
        <Card className="w-full bg-gray-300 max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-semibold">
              Profile
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : user ? (
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Username:</span>{" "}
                  <span className="text-muted-foreground">{user.username}</span>
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  <span className="text-muted-foreground">{user.email}</span>
                </p>
                <p>
                  <span className="font-medium">User ID:</span>{" "}
                  <Link
                    href={`/profile/${user._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {user._id}
                  </Link>
                </p>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                No user data loaded.
              </p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              variant="default"
              onClick={getUserDetails}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Loading..." : "Load User Info"}
            </Button>
            <Button variant="destructive" onClick={logout} className="w-full">
              Logout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
