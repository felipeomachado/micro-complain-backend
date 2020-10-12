import { IsNotEmpty, IsNotEmptyObject } from "class-validator";
import { Company } from "src/interfaces/company.interface";
import { Locale } from "src/interfaces/locale.interface";

export class CreateComplainDto {
  
  @IsNotEmpty()
  readonly title: string;
  
  readonly description: string;
  
  @IsNotEmptyObject()
  readonly locale: Locale;
  
  @IsNotEmptyObject()
  readonly company: Company;
}