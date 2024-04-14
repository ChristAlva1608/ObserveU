"use client";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowUpDown,
  CircleEllipsis,
  DoorOpen,
  Droplets,
  Eclipse,
  Fan,
  FilePlus,
  ListFilter,
  MoveRight,
  PauseCircle,
  PlayCircle,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AddForm } from "./components/form";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn, timeTtimestring, timestringTtime } from "@/lib/utils";
import { SheetProvider, useSheet } from "./hooks/useSheet";
import { TimerEventType } from "@/types/interface";

const data: TimerEventType[] = [
  {
    id: 0,
    device: "pump",
    starttime: "10:00 AM",
    endtime: "11:00 AM",
    status: "active",
  },
  {
    id: 1,
    device: "door",
    starttime: "10:00 PM",
    endtime: "11:00 PM",
    status: "pending",
  },
];

export default function Page() {
  return (
    <SheetProvider>
      <div>
        <div className="flex items-center mb-6 gap-5">
          <h2 className="text-3xl items-center font-bold tracking-tight">
            Timers
          </h2>
          <FilterPopover />
          <CreateEventBtn />
          <EventSheet />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device</TableHead>
              <TableHead>
                <Button variant="ghost">
                  Start Time <ArrowUpDown className="w-4 h-4 ml-1.5" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost">
                  End Time <ArrowUpDown className="w-4 h-4 ml-1.5" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-2 capitalize">
                    {item.device === "pump" ? (
                      <Droplets className="w-4 h-4" />
                    ) : item.device === "fan" ? (
                      <Fan className="w-4 h-4" />
                    ) : (
                      <DoorOpen className="w-4 h-4" />
                    )}
                    {item.device}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="mx-4">{item.starttime && item.starttime}</p>
                </TableCell>
                <TableCell>
                  <p className="mx-4">{item.endtime && item.endtime}</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 capitalize">
                    {item.status === "active" ? (
                      <PlayCircle className="w-4 h-4" />
                    ) : (
                      <PauseCircle className="w-4 h-4" />
                    )}
                    {item.status}
                  </div>
                </TableCell>
                <TableCell>
                  <MoreDropdown item={item} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SheetProvider>
  );
}

function CreateEventBtn() {
  const { setSheetOpen } = useSheet();

  return (
    <Button
      variant="default"
      size="sm"
      onClick={() => {
        setSheetOpen([true, "create"]);
      }}
    >
      <FilePlus className="h-3.5 w-3.5 mr-2" /> Create
    </Button>
  );
}

function MoreDropdown({ item }: { item: TimerEventType }) {
  const { setSheetOpen, setItem } = useSheet();
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 select-none">
            <div className="text-xl mb-2.5">...</div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={6}>
          <DropdownMenuLabel className="select-none">Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setItem(item);
              setSheetOpen([true, "edit"]);
            }}
          >
            Edit
          </DropdownMenuItem>
          <AlertDialogTrigger className="w-full">
            <DropdownMenuItem>
              <span className="text-destructive text-left">Delete</span>
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
        <DeleteDialogContent />
      </DropdownMenu>
    </AlertDialog>
  );
}

function DeleteDialogContent() {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete this event
          and remove it from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          className={cn(buttonVariants({ variant: "destructive" }))}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}

const filterRange: {
  name: "temperature" | "humidity" | "soilmoisture";
  label: string;
  unit: string;
}[] = [
  {
    name: "temperature",
    label: "Temperature",
    unit: "°C",
  },
  {
    name: "humidity",
    label: "Humidity",
    unit: "%",
  },
  {
    name: "soilmoisture",
    label: "Soil moisture",
    unit: "%",
  },
];

function FilterPopoverItem({
  index,
  id,
  children,
  filterCheckbox,
  setFilterCheckbox,
}: {
  index: number;
  id: string;
  children: React.ReactNode;
  filterCheckbox: boolean[];
  setFilterCheckbox: React.Dispatch<React.SetStateAction<boolean[]>>;
}) {
  function handleCheckbox(index: number) {
    setFilterCheckbox((prev) => {
      const cpy = [...prev];
      cpy[index] = !cpy[index];
      return cpy;
    });
  }

  return (
    <>
      <div className="w-36 flex gap-2 items-center">
        <Checkbox
          checked={filterCheckbox[index]}
          onClick={() => {
            handleCheckbox(index);
          }}
        />
        <Label
          htmlFor={id}
          onClick={() => {
            handleCheckbox(index);
          }}
          className="capitalize"
        >
          {id}
        </Label>
      </div>
      {children}
    </>
  );
}

function FilterPopover() {
  const [filterCheckbox, setFilterCheckbox] = React.useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
  ]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="ml-auto">
          <ListFilter className="w-4 h-4 mr-2" /> Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end" sideOffset={6}>
        <div className="space-y-2 mb-4">
          <h4 className="font-medium leading-none">Filter</h4>
          <p className="text-sm text-muted-foreground">
            Select filter(s) for automation.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4 w-full">
            <FilterPopoverItem
              index={0}
              id="device"
              filterCheckbox={filterCheckbox}
              setFilterCheckbox={setFilterCheckbox}
            >
              <Select disabled={!filterCheckbox[0]}>
                <SelectTrigger className="h-8 flex-1" id="device">
                  <SelectValue placeholder="Select device" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pump">Pump</SelectItem>
                  <SelectItem value="fan">Fan</SelectItem>
                  <SelectItem value="door">Door</SelectItem>
                </SelectContent>
              </Select>
            </FilterPopoverItem>
          </div>
          <div className="flex items-center gap-4">
            <FilterPopoverItem
              index={1}
              id="start time"
              filterCheckbox={filterCheckbox}
              setFilterCheckbox={setFilterCheckbox}
            >
              <Input
                disabled={!filterCheckbox[1]}
                id="start time"
                type="time"
                className="flex-1 h-8"
              />
            </FilterPopoverItem>
          </div>
          <div className="flex items-center gap-4">
            <FilterPopoverItem
              index={2}
              id="end time"
              filterCheckbox={filterCheckbox}
              setFilterCheckbox={setFilterCheckbox}
            >
              <Input
                disabled={!filterCheckbox[2]}
                id="end time"
                type="time"
                className="flex-1 h-8"
              />
            </FilterPopoverItem>
          </div>
          {/* {filterRange.map((item, index) => {
            return (
              <div className="flex items-center gap-4" key={index}>
                <div className="w-36 flex gap-2 items-center">
                  <Checkbox
                    checked={filterCheckbox[index + 2]}
                    onClick={() => {
                      handleCheckbox(index + 2);
                    }}
                  />
                  <Label
                    htmlFor={item.name}
                    onClick={() => {
                      handleCheckbox(index + 2);
                    }}
                  >
                    {item.label} ({item.unit})
                  </Label>
                </div>
                <div className="flex gap-4 justify-between flex-1">
                  <Input
                    disabled={!filterCheckbox[index + 2]}
                    id={item.name}
                    type="number"
                    className="basis-1/2 h-8"
                    min="0"
                    max="100"
                    placeholder="min"
                  />
                  <Input
                    disabled={!filterCheckbox[index + 2]}
                    type="number"
                    className="basis-1/2 h-8"
                    min="0"
                    max="100"
                    placeholder="max"
                  />
                </div>
              </div>
            );
          })} */}
        </div>
      </PopoverContent>
    </Popover>
  );
}

const EventSheet: React.FC = () => {
  const { sheetOpen, setSheetOpen } = useSheet();
  return (
    <Sheet
      open={sheetOpen[0]}
      onOpenChange={(open) => {
        if (open) setSheetOpen([true, sheetOpen[1]]);
        else setSheetOpen([false, sheetOpen[1]]);
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-xl font-bold my-3">
            {sheetOpen[1] === "edit" ? "Edit event" : "Create new event"}
          </SheetTitle>
          <SheetDescription>
            <AddForm />
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose asChild></SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
