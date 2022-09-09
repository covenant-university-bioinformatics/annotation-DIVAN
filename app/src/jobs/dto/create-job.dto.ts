import {
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsBooleanString,
} from 'class-validator';
import {
  VariantType, VariantDB, Diseases, InputType,
} from '../models/divan.model';

export class CreateJobDto {
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  job_name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsBooleanString()
  useTest: string;

  @IsNumberString()
  @IsOptional()
  marker_name: string;

  @IsNumberString()
  @IsOptional()
  chr: string;

  @IsNumberString()
  @IsOptional()
  start_position: string;

  @IsNumberString()
  @IsOptional()
  stop_position: string;

  @IsNotEmpty()
  @IsEnum(VariantType)
  variant_type: VariantType;

  @IsNotEmpty()
  @IsEnum(Diseases)
  disease: Diseases

  @IsEnum(VariantDB)
  @IsOptional()
  variant_db: VariantDB;

  @IsNotEmpty()
  @IsEnum(InputType)
  input_type: InputType;
}
