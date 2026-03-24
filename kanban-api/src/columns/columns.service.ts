import { Injectable } from '@nestjs/common';
import { CardsService } from '../cards/cards.service';

@Injectable()
export class ColumnsService {
  constructor(private cardsService: CardsService) { }

  private columns = [
    { id: 1, title: 'A Fazer' },
    { id: 2, title: 'Em Andamento' },
    { id: 3, title: 'Concluído' },
  ];

  findAll() {
    const allCards = this.cardsService.findAll();
    return this.columns.map(column => ({
      ...column,
      cards: allCards.filter(card => Number(card.columnId) === column.id)
    }));
  }

  create(dto: any) {
    const newId = this.columns.length > 0 ? Math.max(...this.columns.map(c => c.id)) + 1 : 1;

    const newColumn = {
      id: newId,
      title: dto.title
    };

    this.columns.push(newColumn);

    return newColumn;
  }

  findOne(id: number) {
    return this.columns.find(c => c.id === Number(id));
  }

  update(id: number, dto: any) {
    const column = this.columns.find(c => c.id === Number(id));
    if (column) {
      column.title = dto.title;
    }
    return column;
  }

  remove(id: number) {
    this.columns = this.columns.filter(c => c.id !== Number(id));
    return { message: `Coluna ${id} removida com sucesso` };
  }
}