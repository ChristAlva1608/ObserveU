"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ClipLoader } from "react-spinners";

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
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Page() {
  // const searchParams = useSearchParams();
  // const error = searchParams.get("error");

  return (
    // <Suspense>

    <div className="flex w-full h-full lg:flex-row-reverse flex-col items-center gap-y-12">
      <div className="lg:basis-1/2 h-full  w-full flex items-center justify-center px-20">
        <div className="w-96 lg:mt-0 mt-10">
          <div className="flex flex-col ">
            <h1 className="text-3xl font-bold tracking-tight text-center ">
              Login
            </h1>
            <p className="text-muted-foreground mt-3 text-center">
              Enter inputs below to login.
            </p>
            <div className="mt-5">
              <AuthForm />
              <Button variant="outline" className="w-full mt-3">
                <Image
                  src="/google-icon.webp"
                  width={0}
                  height={0}
                  alt="Google Icon"
                  className="w-4 h-4 mr-3"
                />
                Login with Google
              </Button>
              <p className="px-8 text-center text-sm text-muted-foreground mt-5">
                If you don&apos;t have an account, please{" "}
                <Link
                  href=""
                  className="underline underline-offset-4 hover:text-primary"
                >
                  register
                </Link>
                .
              </p>
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
    // </Suspense>
  );
}

const formSchema = z.object({
  email: z.string({ required_error: "Do not leave this field empty!" }).email(),

  password: z
    .string({ required_error: "Do not leave this field empty!" })
    .min(1, { message: "This field has to be filled." }),
});

function AuthForm() {
  const router = useRouter();
  const [loginLoading, setLoginLoading] = React.useState<boolean>(false);
  const [loginValid, setLoginValid] = React.useState<boolean>(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // ✅ This will be type-safe and validated.
    setLoginLoading(true);
    setLoginValid(false);
    setTimeout(() => {
      setLoginLoading(false);
      setLoginValid(true);
      setTimeout(() => {
        router.push("/");
      }, 300);
    }, 2000);
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="m@example.com" {...field} />
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
              <FormLabel className="text-black">Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className={cn("w-full", loginLoading && "cursor-not-allowed")}
        >
          Login{" "}
          {loginLoading && (
            <ClipLoader color="white" size={16} className="ml-1.5" />
          )}
          {loginValid && (
            <Check className="text-white w-4 h-4 font-bold ml-1.5" />
          )}
        </Button>
      </form>
    </Form>
  );
}
