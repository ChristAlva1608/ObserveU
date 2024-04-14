"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  Activity,
  Airplay,
  BarChartBig,
  CheckSquare,
  LayoutDashboard,
  PictureInPicture2,
  Settings2,
  Timer,
  Workflow,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const sideBarComponent = [
  {
    id: 0,
    title: "Analytics",
    child: [
      {
        id: 0,
        icon: BarChartBig,
        name: "Analytic",
        path: "/analytic",
      },
    ],
  },
  {
    id: 1,
    title: "",
    child: [
      {
        id: 0,
        icon: PictureInPicture2 ,
        name: "Workspace",
        path: "/mode",
      },
    ],
  },
  {
    id: 2,
    title: "Device",
    child: [
      {
        id: 0,
        icon: Settings2,
        name: "Customize",
        path: "/customize",
      },
    ],
  },
  
  
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="h-full w-64 border-r py-3 fixed bg-muted/40">
      <div className="">
        {sideBarComponent.map((item) => {
          return (
            <div className="px-3" key={item.id}>
              {/* {item.title && (
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                  {item.title}
                </h2>
              )} */}
              {item.child &&
                item.child.map((child) => {
                  return (
                    <div className="space-y-1" key={child.id}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-lg font-medium py-4 h-[44px]",
                          (pathname === child.path ||
                            (child.path !== "/" &&
                              pathname.startsWith(child.path))) &&
                            "bg-accent"
                        )}
                        onClick={() => {
                          router.push(child.path);
                        }}
                      >
                        <child.icon className="h-5 w-5 mr-3.5" />
                        {child.name}
                      </Button>
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
