import { IsNotEmpty} from "class-validator";


export class UpdateComplainDto {
  
  @IsNotEmpty()
  readonly title: string;
  
  readonly description: string;

}