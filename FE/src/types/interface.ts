export type SheetStatusType = "create" | "edit";
export type ControlMode = "manual" | "timer" | "danger zone";
export interface TimerEventType {
  id: number;
  device: "pump" | "fan";
  starttime: string | undefined;
  endtime: string | undefined;
  status: "active" | "pending";
}

export interface Activity {
  id: number;
  name: "pump" | "fan";
  status: boolean;
  time: Date;
  control_type: "manual" | "danger zone";
}

export interface SensorReading {
  id: number;
  name: "temperature" | "humidity" | "soil moisture";
  value: string;
  time: Date;
}
