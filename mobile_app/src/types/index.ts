export type WasteType = "PAPER" | "PLASTIC";

export type UserProfile = {
  id: string;
  name?: string;
  email: string;
};

export type BinStatus = {
  // overall fill shown in the UI (we compute from paper/plastic)
  fillLevel: number; // 0-100
  lastUpdated: number;
  status: "OK" | "FULL" | "CRITICAL";
  paperFill?: number;
  plasticFill?: number;
};

export type WasteLog = {
  id: string;
  type: WasteType;
  confidence: number; // 0..1
  timestamp: number;  // ms
};
