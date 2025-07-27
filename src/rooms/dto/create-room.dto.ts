import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsIn,
  IsNumber,
  Min,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsOptional,
  IsPostalCode,
  Max,
  MinLength,
  IsUrl,
  MaxLength,
  IsEnum
} from "class-validator";


enum RoomService {
  BATHROOM = 'Baño',
  WIFI = 'Wifi',
  FURNISHED = 'Amueblado',
  KITCHEN = 'Cocina',
  AIR_CONDITIONING = 'Clima'
}


export class CreateRoomDto {

  @IsNotEmpty()
  @IsUUID('4')
  id_user: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  zone: string;


  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  images: string[];

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  description: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['Ocupado', 'Disponible', 'En revision'])
  status: 'Ocupado' | 'Disponible' | 'En revision';

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price_monthly: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(RoomService, { each: true })
  @ArrayUnique()
  services?: RoomService[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  other_services?: string[];

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  location_street: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(99999)
  location_number: number;

  @IsNotEmpty()
  @IsString()
  @IsPostalCode('MX')
  location_postal_code: string;

  @IsNotEmpty()
  @IsString()
  city: string

  @IsNotEmpty()
  @IsString()
  state: string
}