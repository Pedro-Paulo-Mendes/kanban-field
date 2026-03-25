import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Card } from './entities/card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService implements OnModuleInit {
  private readonly filePath = path.resolve(process.cwd(), 'src', 'cards.json');
  private cards: Card[] = [];

  onModuleInit() {
    this.loadData();
  }

  private loadData() {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf-8');
        this.cards = JSON.parse(data || '[]');
      }
    } catch (error) {
      this.cards = [];
    }
  }

  private saveData() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.cards, null, 2));
  }

  findAll(): Card[] {
    return this.cards;
  }

  create(createCardDto: CreateCardDto): Card {
    const newCard: Card = {
      id: this.cards.length > 0 ? Math.max(...this.cards.map(c => c.id)) + 1 : 1,
      ...createCardDto,
    };
    this.cards.push(newCard);
    this.saveData();
    return newCard;
  }

  findOne(id: number): Card {
    const card = this.cards.find(c => c.id === id);
    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
    return card;
  }

  update(id: number, updateCardDto: UpdateCardDto): Card {
    const index = this.cards.findIndex(c => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
    this.cards[index] = { ...this.cards[index], ...updateCardDto };
    this.saveData();
    return this.cards[index];
  }

  remove(id: number): { deleted: boolean } {
    const index = this.cards.findIndex(c => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
    this.cards.splice(index, 1);
    this.saveData();
    return { deleted: true };
  }
}