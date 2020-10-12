import { Document } from "mongoose";
import { Company } from "./company.interface";
import { Locale } from "./locale.interface";

export interface Complain extends Document {
  readonly _id: string;
  title: string;
  description: string;
  locale: Locale;
  company: Company;
}

