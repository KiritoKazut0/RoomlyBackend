import { 
    IsUUID,
    IsString,
    IsNotEmpty,
    IsNumber,
    Min,
    Max 
} from 'class-validator';

export class CreateReviewDto {
  @IsUUID('4')
  @IsNotEmpty()
  id_user: string;

  @IsUUID('4')
  @IsNotEmpty()
  id_room: string;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsNumber()
  @Min(1)
  @Max(10)
  calif: number; 
}
