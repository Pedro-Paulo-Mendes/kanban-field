import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getColumns(): Observable<Column[]> {
    return this.http.get<Column[]>(`${this.apiUrl}/columns`);
  }

  addColumn(title: string): Observable<Column> {
    return this.http.post<Column>(`${this.apiUrl}/columns`, { title });
  }

  deleteColumn(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/columns/${id}`);
  }

  addCard(columnId: number, title: string, description: string = ''): Observable<Card> {
    return this.http.post<Card>(`${this.apiUrl}/cards`, { columnId, title, description });
  }

  updateCard(card: Card): Observable<Card> {
    return this.http.patch<Card>(`${this.apiUrl}/cards/${card.id}`, card);
  }

  deleteCard(cardId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cards/${cardId}`);
  }
}