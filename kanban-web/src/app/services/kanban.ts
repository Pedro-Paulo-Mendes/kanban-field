import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 1. Ensinamos ao Angular o formato exato de um Card
export interface Card {
  id: number;
  title: string;
  description: string;
  columnId: number;
}

// 2. Ensinamos o formato de uma Coluna (que tem uma lista de cards dentro)
export interface Column {
  id: number;
  title: string;
  cards: Card[];
}

@Injectable({
  providedIn: 'root'
})
export class KanbanService {
  // O endereço onde o nosso motor NestJS está rodando!
  private apiUrl = 'http://localhost:3000';

  // O Angular "injeta" o HttpClient aqui para podermos fazer as ligações
  constructor(private http: HttpClient) { }

  // Função para buscar as colunas e os cards no backend
  getColumns(): Observable<Column[]> {
    return this.http.get<Column[]>(`${this.apiUrl}/columns`);
  }
}