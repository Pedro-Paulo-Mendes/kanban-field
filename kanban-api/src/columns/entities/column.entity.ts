import { Card } from '../../cards/entities/card.entity';

export class Column {
  id: number;
  title: string;
  cards?: Card[];
}