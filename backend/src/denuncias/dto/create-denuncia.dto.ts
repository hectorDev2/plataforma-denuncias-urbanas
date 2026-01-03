import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDenunciaDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  latitud?: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  longitud?: number;

  @IsOptional()
  @IsString()
  direccion?: string;
}
