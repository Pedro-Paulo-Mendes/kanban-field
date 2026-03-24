import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CardsService implements OnModuleInit {
  // Caminho para o arquivo que você acabou de criar
  // Caminho para o arquivo que agora aponta corretamente para a pasta src
  private readonly filePath = path.resolve(process.cwd(), 'src', 'cards.json');
  private cards: any[] = [];

  // Esse método roda automaticamente quando o servidor liga
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
      console.error('Erro ao ler cards.json, resetando memória.', error);
      this.cards = [];
    }
  }

  private saveData() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.cards, null, 2));
  }

  findAll() {
    return this.cards;
  }

  create(createCardDto: any) {
    const newCard = {
      id: this.cards.length > 0 ? Math.max(...this.cards.map(c => c.id)) + 1 : 1,
      ...createCardDto,
    };
    this.cards.push(newCard);
    this.saveData(); // Escreve no arquivo físico
    return newCard;
  }

  findOne(id: number) {
    return this.cards.find(c => c.id === Number(id));
  }

  // Se você tiver esses métodos no Controller, adicione-os aqui também:
  update(id: number, updateCardDto: any) {
    const index = this.cards.findIndex(c => c.id === Number(id));
    if (index !== -1) {
      this.cards[index] = { ...this.cards[index], ...updateCardDto };
      this.saveData();
      return this.cards[index];
    }
  }

  remove(id: number) {
    const index = this.cards.findIndex(c => c.id === Number(id));
    if (index !== -1) {
      this.cards.splice(index, 1);
      this.saveData();
      return { deleted: true };
    }
  }
}