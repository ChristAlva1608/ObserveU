"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangle,
  DoorOpen,
  Droplet,
  Droplets,
  Fan,
  FileDigit,
  History,
  Leaf,
  LucideIcon,
  Power,
  Sigma,
  Thermometer,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/multislider";
import { ControlMode } from "@/types/interface";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function Page() {
  const [deviceState, setDeviceState] = React.useState<boolean[]>([
    false,
    false,
  ]);

  React.useEffect(() => {
    const fetchDeviceStatus = async () => {
      try {
        // Fetch status of both pump and fan devices concurrently
        const [pumpStateResponse, fanStateResponse] = await Promise.all([
          supabase
            .from("device")
            .select("status")
            .eq("name", "fan")
            .order("time", { ascending: false })
            .limit(1),
          supabase
            .from("device")
            .select("status")
            .eq("name", "pump")
            .order("time", { ascending: false })
            .limit(1),
        ]);

        // Update state with the latest status values
        if (
          pumpStateResponse.data &&
          pumpStateResponse.data.length > 0 &&
          fanStateResponse.data &&
          fanStateResponse.data.length > 0
        ) {
          setDeviceState([
            fanStateResponse.data[0].status,
            pumpStateResponse.data[0].status,
          ]);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchDeviceStatus();

    supabase
      .channel("device-change")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "device",
        },
        fetchDeviceStatus
      )
      .subscribe();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Devices</h2>
        <DangerDialog />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Device
          title="pump"
          description="Plant irrigation"
          icon={Droplets}
          info={{ useCount: 100, useTime: 100, mode: "manual" }}
          active={deviceState[0]}
        />
        <Device
          title="fan"
          description="Temperature regulation"
          icon={Fan}
          info={{ useCount: 100, useTime: 100, mode: "manual" }}
          active={deviceState[1]}
        />
      </div>
    </div>
  );
}

interface DeviceProps {
  title: "pump" | "fan";
  description: string;
  icon: LucideIcon;
  info: { useCount: number; useTime: number; mode: ControlMode };
  active: boolean;
}

function Device({ title, description, icon: Icon, info, active }: DeviceProps) {
  return (
    <Card
      className={cn(active && "border-primary ", "h-fit box-border border-2")}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex flex-col gap-1">
          <CardTitle className="font-semibold text-lg capitalize">
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Icon
          className={cn(
            "h-6 w-6 text-muted-foreground",
            active && "text-black"
          )}
        />
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className="text-[15px] flex items-center mb-1.5">
          <Sigma className="h-3.5 w-3.5 mr-2" />
          <p className="mt-0.5">
            <span className="font-medium">Usage Count: </span> {info.useCount}{" "}
            times
          </p>
        </div>
        <div className="text-[15px] flex items-center mb-1.5">
          <History className="h-3.5 w-3.5 mr-2" />
          <p className="mt-0.5">
            <span className="font-medium">Usage Time: </span> {info.useTime}{" "}
            mins
          </p>
        </div>
        <div className="text-[15px] flex items-center mb-1.5">
          <Power className="h-3.5 w-3.5 mr-2" />
          <p className="mt-0.5 capitalize">
            <span className="font-medium normal-case">Current Mode: </span>{" "}
            {info.mode}
          </p>
        </div>
      </CardContent>
      <CardFooter className=" rounded-b-lg bg-accent h-24 py-0 flex items-center justify-center">
        <div className="flex flex-col gap-2.5 items-center">
          <p className="font-medium text-muted-foreground">Power</p>
          {/* <Switch checked={active} /> */}
          <Button
            size="sm"
            className={cn(
              buttonVariants({ variant: "default" }),
              "font-semibold cursor-default"
            )}
          >
            {active ? "ON" : "OFF"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

const dangeRangSlider: {
  id: number;
  icon: LucideIcon;
  label: string;
  unit: string;
}[] = [
  {
    id: 0,
    icon: Thermometer,
    label: "Temperature",
    unit: "°C",
  },
  {
    id: 1,
    icon: Droplet,
    label: "Humidity",
    unit: "%",
  },
  {
    id: 2,
    icon: Leaf,
    label: "Soil Moisture",
    unit: "%",
  },
];

function DangerDialog() {
  const [dangeRanges, setDangerRange] = React.useState<number[]>([
    100, 100, 100,
  ]);

  React.useEffect(() => {
    const setDangerZone = async () => {
      try {
        const { data, error } = await supabase
          .from("dangerzone")
          .select("value")
          .order("time", { ascending: false });
        if (data) {
          setDangerRange(data[0].value);
        }
        console.log(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    setDangerZone();

    supabase
      .channel("dangerzone-change")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "dangerzone",
        },
        (payload: any) => {
          setDangerRange(payload.new.value);
        }
      )
      .subscribe();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2" /> Danger Zone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-1 mt-2 text-destructive">
            Danger Zone
          </DialogTitle>
          <DialogDescription>Last update: </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-4">
          {dangeRangSlider.map((item, index) => {
            return (
              <div className="flex gap-2 items-center" key={index}>
                <item.icon className="w-4 h-4" />
                <p className="select-none text-sm font-medium">
                  {item.label}: {dangeRanges[item.id]}
                  {item.unit}
                </p>
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
