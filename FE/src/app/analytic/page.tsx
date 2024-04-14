"use client";
import React from "react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AudioLines,
  Briefcase,
  CalendarIcon,
  Frown,
  Smile,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  AreaChart,
  Area,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Sector,
  Pie,
  PieChart,
} from "recharts";
import { TooltipProps } from "recharts";
// for recharts v2.1 and above
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Page() {
  return (
    <div className="">
      <div className="flex items-center">
        <h2 className="text-3xl font-bold tracking-tight">Analytic</h2>
        <DatePickerDemo />
        <Button className="ml-2">Download</Button>
      </div>
      <div className="mt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Worktime
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10.2 hours</div>
              <p className="text-xs text-muted-foreground">6 hours yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Most Sufficient Worktime
              </CardTitle>
              <Smile className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">9AM - 10AM</div>
              <p className="text-xs text-muted-foreground">
                8AM - 10AM yesterday
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Least Sufficient Worktime
              </CardTitle>
              <Frown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2PM - 3PM</div>
              <p className="text-xs text-muted-foreground">
                3PM - 4PM yesterday
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Song played</CardTitle>
              <AudioLines className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24 songs</div>
              <p className="text-xs text-muted-foreground">
                18 songs yesterday
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="">
            <LineChartMain />
          </CardContent>
        </Card>
        <Card className="col-span-3 h-fit">
          <CardHeader>
            <CardTitle>Coding Mode</CardTitle>
            <CardDescription className="mt-2">
              Coding mode statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Mode</TableHead>
                  <TableHead>Worktime</TableHead>
                  <TableHead>Song played</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Relaxed</TableCell>
                  <TableCell>5 hours</TableCell>
                  <TableCell>12 songs</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Pomodoro</TableCell>
                  <TableCell>2.2 hours</TableCell>
                  <TableCell>5 songs</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Hardcore</TableCell>
                  <TableCell>3 hours</TableCell>
                  <TableCell>7 songs</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal ml-auto",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

const data = [
  {
    name: "0h",
    uv: 40,
    pv: 20,
  },
  {
    name: "1h",
    uv: 32,
    pv: 18,
  },
  {
    name: "2h",
    uv: 20,
    pv: 90,
  },
  {
    name: "3h",
    uv: 27,
    pv: 38,
  },
  {
    name: "4h",
    uv: 18,
    pv: 40,
  },
  {
    name: "5h",
    uv: 23,
    pv: 30,
  },
  {
    name: "6h",
    uv: 34,
    pv: 23,
  },
  {
    name: "7h",
    uv: 56,
    pv: 56,
  },
  {
    name: "8h",
    uv: 34,
    pv: 67,
  },
  {
    name: "9h",
    uv: 19,
    pv: 34,
  },
  {
    name: "10h",
    uv: 78,
    pv: 45,
  },
  {
    name: "11h",
    uv: 32,
    pv: 40,
  },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active) {
    return (
      <div className="p-3 bg-white border rounded-md">
        <p className="label">{`${label} : ${payload?.[0].value}`}</p>
        <p className="desc">Anything you want can be displayed here.</p>
      </div>
    );
  }
  return null;
};

export function LineChartMain() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart width={500} height={400} data={data}>
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="name" />
        <YAxis
          strokeWidth={1.5}
          orientation="left"
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} />
        <Brush dataKey="name" height={30} stroke="rgb(25, 118, 210)" />

        <Line
          activeDot={{ r: 8 }}
          strokeWidth={2}
          name="Notification count"
          type="monotone"
          dataKey="pv"
          stroke="rgb(25, 118, 210)"
        />
        <Line
          activeDot={{ r: 8 }}
          strokeWidth={2}
          name="Hand Gesture count "
          type="monotone"
          dataKey="uv"
          stroke="#ff7300"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
