import { Injectable, NotFoundException } from '@nestjs/common';
import { CardsService } from '../cards/cards.service';
import { Column } from './entities/column.entity';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnsService {
  constructor(private cardsService: CardsService) {}

  private columns: Column[] = [
    { id: 1, title: 'A Fazer' },
    { id: 2, title: 'Em Andamento' },
    { id: 3, title: 'Concluído' },
  ];

  findAll(): Column[] {
    const allCards = this.cardsService.findAll();
    return this.columns.map(column => ({
      ...column,
      cards: allCards.filter(card => Number(card.columnId) === column.id),
    }));
  }

  create(createColumnDto: CreateColumnDto): Column {
    const newId = this.columns.length > 0 ? Math.max(...this.columns.map(c => c.id)) + 1 : 1;

    const newColumn: Column = {
      id: newId,
      title: createColumnDto.title,
    };

    this.columns.push(newColumn);
    return newColumn;
  }

  findOne(id: number): Column {
    const column = this.columns.find(c => c.id === id);
    if (!column) {
      throw new NotFoundException(`Column with ID ${id} not found`);
    }
    return column;
  }

  update(id: number, updateColumnDto: UpdateColumnDto): Column {
    const index = this.columns.findIndex(c => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Column with ID ${id} not found`);
    }
    this.columns[index] = { ...this.columns[index], ...updateColumnDto };
    return this.columns[index];
  }

  remove(id: number): { message: string } {
    const initialLength = this.columns.length;
    this.columns = this.columns.filter(c => c.id !== id);
    if (this.columns.length === initialLength) {
      throw new NotFoundException(`Column with ID ${id} not found`);
    }
    return { message: `Column ${id} removed successfully` };
  }
}