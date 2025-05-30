"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { imgUpload } from "@/app/actions/imgUpload";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const profileFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export function ProfileForm({ user }) {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.photo || null);

  const defaultValues = {
    username: user?.name,
    email: user.email,
  };

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (user?.name && user?.email) {
      form.reset({
        username: user.name,
        email: user.email,
      });
      3;
    }
  }, [user, form]);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  async function onSubmit(data) {
    setIsLoading(true);

    try {
      await toast.promise(
        (async () => {
          const res = await fetch(`/api/profile/update-name/${user.email}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: data?.username }),
          });

          const result = await res.json();

          if (!res.ok) {
            throw new Error(result.error || "Failed to update Username!");
          }

          return result;
        })(),
        {
          loading: "Updating username...",
          success: "Username updated successfully!",
          error: (err) => err.message || "Something went wrong!",
        }
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async () => {
    if (!avatarFile) {
      toast.error("Please select an image first!");
      return;
    }

    await toast.promise(
      (async () => {
        const imageUrl = await imgUpload(avatarFile);

        const res = await fetch(`/api/profile/update-photo/${user?.email}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ photo: imageUrl }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to update photo");
        }

        return data;
      })(),
      {
        loading: "Uploading image & updating profile...",
        success: "Profile photo updated successfully!",
        error: (err) => err.message || "Something went wrong!",
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={avatarPreview || "/placeholder.svg?height=80&width=80"}
              alt={user.name}
            />
            <AvatarFallback className="text-lg">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-1 -right-1 bg-primary text-primary-foreground p-1 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
          >
            <Camera className="h-4 w-4" />
            <span className="sr-only">Upload avatar</span>
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <div>
          <h3 className="text-lg font-medium">Profile Picture</h3>
          <p className="text-sm text-muted-foreground">
            Click the camera icon to upload a new profile picture
          </p>
          <Button
            className="mt-1"
            size="md"
            variant="outline"
            onClick={uploadPhoto}
          >
            Update Photo
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Your username" {...field} />
                </FormControl>
                <FormDescription>
                  This is your unique username for the platform.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your email address" {...field} readOnly />
                </FormControl>
                <FormDescription>
                  Your email address is used for notifications and account
                  recovery.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="-mt-0.5 h-4 w-4 animate-spin" />}
            {isLoading ? "Updating..." : "Update profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
