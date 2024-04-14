"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { Suspense } from "react";

export default function Page() {
  // const searchParams = useSearchParams();
  // const error = searchParams.get("error");

  return (
      <div className="flex w-full h-full lg:flex-row-reverse flex-col items-center gap-y-12">
        <div className="lg:basis-1/2 h-full  w-full flex items-center justify-center px-20">
          <div className="w-96 lg:mt-0 mt-10">
            <div className="flex flex-col ">
              <h1 className="text-3xl font-semibold tracking-tight text-center ">
                Register
              </h1>
              <p className="text-muted-foreground mt-3 text-center">
                Enter inputs below to create new account.
              </p>
              <div className="my-7">
                <AuthForm />
              </div>
            </div>
            {/* {error && (
              <p className="text-destructive text-sm font-semibold mt-6">
                *Tài khoản Google không tồn tại trong hệ thống
              </p>
            )} */}
          </div>
        </div>
        {/* <Image src="/auth/login/hospitalBG.jpg" width={0} height={0} priority={true} alt="HospitalBG" className="lg:basis-1/2 mt-0 lg:h-full object-cover blur-[2px]"/> */}
        <div className="lg:basis-1/2 mt-0 lg:h-full bg-primary" />
      </div>
  );
}

const formSchema = z.object({
  username: z
    .string({ required_error: "Do not leave this field empty!" })
    .min(4, {
      message: "Username must be at least 4 characters.",
    })
    .max(20, {
      message: "Username must be at most 20 characters.",
    }),
  email: z
    .string({ required_error: "Do not leave this field empty!" })
    .email("This is not a valid email."),
  password: z
    .string({ required_error: "Do not leave this field empty!" })
    .min(6, {
      message: "Password must be at least 6 characters.",
    })
    .max(20, {
      message: "Password must be at most 20 characters.",
    }),
});

function AuthForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">
                Username <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Username length from 4 - 20 characters.
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
              <FormLabel className="text-black">
                Email <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="example@mail.com" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">
                Password <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Password length from 6 - 20 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Register
        </Button>
        <p className="px-8 text-center text-sm text-muted-foreground">
          If you have an account, please{" "}
          <Link
            href="/authenticate/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            login
          </Link>{" "}
          .
        </p>
      </form>
    </Form>
  );
}
