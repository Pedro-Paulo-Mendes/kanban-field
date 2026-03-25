import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { Column } from './entities/column.entity';

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post()
  create(@Body() createColumnDto: CreateColumnDto): Column {
    return this.columnsService.create(createColumnDto);
  }

  @Get()
  findAll(): Column[] {
    return this.columnsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Column {
    return this.columnsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateColumnDto: UpdateColumnDto): Column {
    return this.columnsService.update(id, updateColumnDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): { message: string } {
    return this.columnsService.remove(id);
  }
}
