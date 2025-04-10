import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ServiceItem {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  cost: number;
}

export class CreateBillDto {
  @IsNotEmpty()
  @IsMongoId()
  patientId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceItem)
  services: ServiceItem[];
}
