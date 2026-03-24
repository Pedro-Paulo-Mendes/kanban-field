import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Card {
  id?: number;
  title: string;
  description: string;
  columnId: number;
}

export interface Column {
  id?: number;
  title: string;
  cards: Card[];
}

@Injectable({
  providedIn: 'root'
})
export class KanbanService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getColumns(): Observable<Column[]> {
    return this.http.get<Column[]>(`${this.apiUrl}/columns`);
  }

  addColumn(title: string) {
    return this.http.post(`${this.apiUrl}/columns`, { title });
  }

  updateColumn(id: number, title: string): Observable<Column> {
    return this.http.patch<Column>(`${this.apiUrl}/columns/${id}`, { title });
  }

  deleteColumn(id: number) {
    return this.http.delete(`${this.apiUrl}/columns/${id}`);
  }

  updateCard(card: Card): Observable<Card> {
    return this.http.patch<Card>(`${this.apiUrl}/cards/${card.id}`, card);
  }
  addCard(columnId: number, title: string, description: string = ''): Observable<any> {
    return this.http.post(`${this.apiUrl}/cards`, { columnId, title, description });
  }

  deleteCard(cardId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cards/${cardId}`);
  }
}