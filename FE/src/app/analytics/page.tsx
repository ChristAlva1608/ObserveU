"use client";

import { cn, dateDisplay } from "@/lib/utils";
import React, { PureComponent } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ArrowUpDown,
  Calendar as CalendarIcon,
  Droplet,
  Leaf,
  PlusCircle,
  Thermometer,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowUpCircle,
  CheckCircle2,
  Circle,
  HelpCircle,
  LucideIcon,
  XCircle,
} from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { CommandSeparator } from "cmdk";
import { Badge } from "@/components/ui/badge";
import { TooltipProps } from "recharts";
// for recharts v2.1 and above
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { SensorReading } from "@/types/interface";

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="w-52 custom-tooltip bg-white p-4 border rounded-md">
        <p className="font-semibold">{`${label}`}</p>
        <p className="mt-1">{`${payload[0].name}: ${payload[0].value}°C`}</p>
        <p className="mt-1">{`${payload[1].name}: ${payload[1].value}%`}</p>
        <p className="mt-1">{`${payload[2].name}: ${payload[2].value}%`}</p>
      </div>
    );
  }

  return null;
};

export default function Page() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const [sensorReading, setSensorReading] = React.useState<SensorReading[]>([]);

  React.useEffect(() => {
    const setSensor = async () => {
      try {
        const { data, error } = await supabase
          .from("sensor")
          .select()
          .order("time", { ascending: false })
          .order("id");
        if (data) {
          setSensorReading(data);
        }
        console.log(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    setSensor();

    supabase
      .channel("sensor-change")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sensor",
        },
        setSensor
        // (payload: any) => {
        //   setActivities((prev) => {
        //     console.log(payload.new);
        //     return [payload.new, ...prev];
        //   });
        // }
      )
      .subscribe();
  }, []);

  return (
    <div>
      <div className="flex">
        <h2 className="text-3xl items-center font-bold tracking-tight mb-6 mr-5">
          Analytics
        </h2>
        <ComboboxPopover />
        <DatePicker />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-semibold text-lg">
              Detail statistic
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead>Sensor Readings</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>
                  <Button variant="ghost">
                    Time <ArrowUpDown className="w-4 h-4 ml-1.5" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sensorReading &&
                sensorReading.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2 capitalize">
                        {item.name === "temperature" ? (
                          <Thermometer className="w-4 h-4" />
                        ) : item.name === "humidity" ? (
                          <Droplet className="w-4 h-4" />
                        ) : (
                          <Leaf className="w-4 h-4" />
                        )}
                        {item.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {!item.value ? "0" : item.value}
                      {item.name === "temperature" ? "°C" : "%"}
                    </TableCell>
                    <TableCell>
                      <p className="mx-4">{dateDisplay(new Date(item.time))}</p>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function DatePicker() {
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
          <CalendarIcon className="mr-2 h-3.5 w-3.5" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
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

type Status = {
  value: string;
  label: string;
  icon: LucideIcon;
};

const statuses: Status[] = [
  {
    value: "temperature",
    label: "Temperature",
    icon: Thermometer,
  },
  {
    value: "humidity",
    label: "Humidity",
    icon: Droplet,
  },
  {
    value: "soil moisture",
    label: "Soil Moisture",
    icon: Leaf,
  },
];

function ComboboxPopover() {
  const [select, setSelect] = React.useState<string[]>([]);

  function selectClickHandle(status: Status) {
    if (select.includes(status.label)) {
      setSelect(select.filter((item) => item !== status.label));
    } else setSelect([...select, status.label]);
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="justify-start border-dashed"
          >
            <PlusCircle className="h-3.5 w-3.5 mr-2" /> Criteria{" "}
            {select.length !== 0 && (
              <span className="ml-2 mr-1 text-muted-foreground font-thin">
                |
              </span>
            )}
            {select &&
              select.map((item, index) => {
                return (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="rounded-sm font-medium mx-1"
                  >
                    {item}
                  </Badge>
                );
              })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="bottom" align="start">
          <Command>
            <CommandInput placeholder="Criteria" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {statuses.map((status) => (
                  <CommandItem
                    key={status.value}
                    value={status.value}
                    className="p-0"
                  >
                    <div
                      className="flex items-center w-full h-full px-2 py-1.5"
                      onClick={() => {
                        selectClickHandle(status);
                      }}
                    >
                      <Checkbox
                        checked={select.includes(status.label)}
                        onClick={() => {
                          selectClickHandle(status);
                        }}
                      />
                      <status.icon className={cn("mx-2 h-3.5 w-3.5")} />
                      <span>{status.label}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Button
        size="sm"
        variant="ghost"
        className="h-9 ml-2 px-2.5"
        onClick={() => {
          setSelect([]);
        }}
      >
        Reset <X className="h-3.5 w-3.5 ml-1.5" />
      </Button>
    </>
  );
}
