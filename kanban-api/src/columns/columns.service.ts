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

  // Métodos "Placeholder" para o Controller não reclamar
  create(dto: any) { return 'Esta ação adiciona uma nova coluna'; }
  findOne(id: number) { return `Esta ação retorna a coluna #${id}`; }
  update(id: number, dto: any) { return `Esta ação atualiza a coluna #${id}`; }
  remove(id: number) { return `Esta ação remove a coluna #${id}`; }
}