"use client";

import { SheetStatusType, TimerEventType } from "@/types/interface";
import * as React from "react";

const sheetContext = React.createContext<{
  sheetOpen: [boolean, SheetStatusType];
  setSheetOpen: React.Dispatch<
    React.SetStateAction<[boolean, SheetStatusType]>
  >;
  item: TimerEventType | undefined;
  setItem: React.Dispatch<React.SetStateAction<TimerEventType | undefined>>;
} | null>(null);

export function useSheet() {
  const contextValue = React.useContext(sheetContext);
  if (!contextValue) {
    throw new Error("useSheet must be used within a SheetProvider");
  }
  return contextValue;
}

export function SheetProvider({ children }: { children: React.ReactNode }) {
  const [sheetOpen, setSheetOpen] = React.useState<[boolean, SheetStatusType]>([
    false,
    "create",
  ]);
  const [item, setItem] = React.useState<TimerEventType | undefined>(undefined);

  return (
    <sheetContext.Provider value={{ sheetOpen, setSheetOpen, item, setItem }}>
      {children}
    </sheetContext.Provider>
  );
}
