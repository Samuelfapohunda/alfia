import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

class ServiceItem {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  cost: number;
}

export class CreateBillDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsMongoId()
  userId: ObjectId;

  @IsArray()
  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => ServiceItem)
  services: ServiceItem[];
}
