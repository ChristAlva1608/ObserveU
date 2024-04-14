import { SheetStatusType } from "@/types/interface";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateDisplay(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours() % 12 || 12).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const amPM = date.getHours() < 12 ? "AM" : "PM";

  return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds} ${amPM}`;
}

export function timeTtimestring(time24: string) {
  const [hours, minutes] = time24.split(":").map(Number);
  console.log(time24);
  if (
    isNaN(hours) ||
    isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  )
    return "Invalid time format";
  return `${(hours % 12 || 12).toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${hours < 12 ? "AM" : "PM"}`;
}

export function timestringTtime(time12: string) {
  const [time, period] = time12.split(" ");
  const [hoursStr, minutesStr] = time.split(":");
  let hours = parseInt(hoursStr, 10);

  if (
    isNaN(hours) ||
    isNaN(parseInt(minutesStr, 10)) ||
    hours < 1 ||
    hours > 12 ||
    (period !== "AM" && period !== "PM")
  )
    return "Invalid time format";

  if (period === "PM" && hours < 12) hours += 12;
  else if (period === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutesStr}`;
}
