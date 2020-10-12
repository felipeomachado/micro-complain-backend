import { Document } from "mongoose";

export interface Locale extends Document {
  readonly _id: string;
  cityId: number;
  cityName: string;
  state: string;
}