"use client";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Circle, Video, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import CombinedComponent from "./facemesh.js";
import WebcamThrottlingChecker from "./face.js"

const FaceMeshComponent = dynamic(() => import("./facemesh.js"), {
  ssr: false,
});

export default function Page() {
  return (
    <>
      <Card className="max-w-[800px]">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            Video <Video className="w-6 h-6 font-bold" />
          </CardTitle>
          {/* <CardDescription>Card Description</CardDescription> */}
        </CardHeader>
        <CardContent className="h-full flex">
          <div className="w-full h-full">
            <CombinedComponent />
          </div>
          <div className="ml-auto w-[180px] flex flex-col justify-between">
            <Button
              variant="default"
              className="w-full mx-auto flex items-center gap-1.5"
            >
              Start recording{" "}
              <Zap className="w-4 h-4" />
            </Button>
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex justify-center">Comment</CardTitle>
                {/* <CardDescription>Card Description</CardDescription> */}
              </CardHeader>
              <CardContent className="h-full flex">aa</CardContent>
            </Card>
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex justify-center">Comment</CardTitle>
                {/* <CardDescription>Card Description</CardDescription> */}
              </CardHeader>
              <CardContent className="h-full flex">aa</CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
