import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn, timeTtimestring, timestringTtime } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/multislider";
import React from "react";
import { Check } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { useSheet } from "../hooks/useSheet";

// const formCheckBox: {
//   name: "temperature" | "humidity" | "soilmoisture";
//   label: string;
//   unit: string;
// }[] = [
//   {
//     name: "temperature",
//     label: "Temperature",
//     unit: "°C",
//   },
//   {
//     name: "humidity",
//     label: "Humidity",
//     unit: "%",
//   },
//   {
//     name: "soilmoisture",
//     label: "Soil moisture",
//     unit: "%",
//   },
// ];

const formSchema = z.object({
  device: z.string({
    required_error: "Please select a device.",
  }),
  starttime: z.string({
    required_error: "Please select a start time.",
  }),
  endtime: z.string({
    required_error: "Please select an end time.",
  }),
  status: z.string({
    required_error: "Please select a status.",
  }),
  // temperature: z.array(z.number()).optional(),
  // humidity: z.array(z.number()).optional(),
  // soilmoisture: z.array(z.number()).optional(),
});
// .refine(
//   (data) =>
//     data.starttime || data.temperature || data.humidity || data.soilmoisture,
//   {
//     message: "Please select at least one criteria",
//     path: ["starttime"],
//   }
// )
// .refine(
//   (data) =>
//     data.starttime || data.temperature || data.humidity || data.soilmoisture,
//   {
//     message: "Please select at least one criteria",
//     path: ["temperature"],
//   }
// )
// .refine(
//   (data) =>
//     data.starttime || data.temperature || data.humidity || data.soilmoisture,
//   {
//     message: "Please select at least one criteria",
//     path: ["humidity"],
//   }
// )
// .refine(
//   (data) =>
//     data.starttime || data.temperature || data.humidity || data.soilmoisture,
//   {
//     message: "Please select at least one criteria",
//     path: ["soilmoisture"],
//   }
// );

function AddForm() {
  const { sheetOpen, setSheetOpen, item } = useSheet();

  const [submitState, setSubmitState] = React.useState<
    "none" | "loading" | "done"
  >("none");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      device: sheetOpen[1] === "edit" ? item?.device : undefined,
      starttime:
        sheetOpen[1] === "edit" ? timestringTtime(item?.starttime!) : undefined,
      endtime:
        sheetOpen[1] === "edit" ? timestringTtime(item?.endtime!) : undefined,
      status: sheetOpen[1] === "edit" ? item?.status : undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (submitState === "loading") return;
    else if (submitState === "done") {
      setSheetOpen([false, sheetOpen[1]]);
      setSubmitState("none");
      return;
    }
    handleSubmit(values, setSubmitState);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="device"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-medium">
                Device <span className="text-destructive">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a device" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pump">Pump</SelectItem>
                  <SelectItem value="fan">Fan</SelectItem>
                  <SelectItem value="door">Door</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="starttime"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="starttime" className="text-black font-medium">
                Start Time <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="time"
                  placeholder="Start time"
                  {...field}
                  onChange={(e) => {
                    console.log(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endtime"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="endtime" className="text-black font-medium">
                End Time <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input type="time" placeholder="End time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {sheetOpen[1] === "edit" && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-medium">
                  Status <span className="text-destructive">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div>
          <Button
            type="submit"
            className={cn(
              "w-full mt-3",
              submitState === "loading" && "cursor-not-allowed"
            )}
            variant="default"
          >
            {submitState === "done" ? (
              <>
                Done <Check className="h-4 w-4 ml-2" />
              </>
            ) : submitState === "loading" ? (
              <>
                Loading <Loader className="h-4 w-4 ml-2" />
              </>
            ) : sheetOpen[1] === "edit" ? (
              "Edit"
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function handleSubmit(
  values: {
    device: string | undefined;
    starttime?: string | undefined;
    temperature?: number[] | undefined;
    humidity?: number[] | undefined;
    soilmoisture?: number[] | undefined;
  },
  setSubmitState: React.Dispatch<
    React.SetStateAction<"none" | "loading" | "done">
  >
) {
  setSubmitState("loading");
  setTimeout(function () {
    // Your code to execute after 2 seconds
    setSubmitState("done");
  }, 4000); // 2000 milliseconds = 2 seconds

  console.log(values);
}

export { AddForm };
