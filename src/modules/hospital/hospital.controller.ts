import { Controller, Post, Get, Param, Body, Patch, Delete } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { CreateHospitalDto, UpdateHospitalDto } from 'src/common/dto/hospital.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('hospitals')
@ApiTags('Hospital')
@ApiBearerAuth()
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Post()
  create(@Body() createHospitalDto: CreateHospitalDto) {
    return this.hospitalService.createHospital(createHospitalDto);
  }

  @Get()
  findAll() {
    return this.hospitalService.findAllHospitals();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hospitalService.findHospitalById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHospitalDto: UpdateHospitalDto) {
    return this.hospitalService.updateHospital(id, updateHospitalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hospitalService.deleteHospital(id);
  }
}
