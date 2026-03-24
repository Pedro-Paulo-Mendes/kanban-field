import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Added for [(ngModel)]
import { KanbanService, Column, Card } from './services/kanban';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule], // Added FormsModule
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  columns: Column[] = [];

  // Modal State
  isModalOpen = false;
  modalType: 'column' | 'card' = 'column';
  modalTitle = '';
  modalDescription = '';
  currentColumnId?: number;

  constructor(
    private kanbanService: KanbanService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.loadColumns();
  }

  loadColumns() {
    this.kanbanService.getColumns().subscribe({
      next: (dados) => {
        console.log('🕵️‍♂️ DADOS QUE CHEGARAM DO BACKEND:', dados);
        this.zone.run(() => {
          this.columns = [...dados];
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        });
      },
      error: (erro) => console.error('Erro ao buscar dados:', erro)
    });
  }

  readonly LIMITS = {
    colTitle: 20,
    cardTitle: 50,
    cardDesc: 200
  };

  addColumn() {
    this.openModal('column');
  }

  addCardGlobal() {
    if (this.columns.length > 0) {
      this.openModal('card', this.columns[0].id);
    }
  }

  addCard(columnId: number) {
    this.openModal('card', columnId);
  }

  openModal(type: 'column' | 'card', columnId?: number) {
    this.modalType = type;
    this.currentColumnId = columnId;
    this.modalTitle = '';
    this.modalDescription = '';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveModal() {
    if (!this.modalTitle) return;

    if (this.modalType === 'column') {
      if (this.modalTitle.length > this.LIMITS.colTitle) return;

      this.kanbanService.addColumn(this.modalTitle).subscribe({
        next: () => {
          this.zone.run(() => {
            this.loadColumns();
            this.closeModal();
          });
        },
        error: (err) => {
          console.error('Erro ao criar coluna:', err);
          this.zone.run(() => this.loadColumns());
        }
      });
    } else if (this.modalType === 'card' && this.currentColumnId !== undefined) {
      if (this.modalTitle.length > this.LIMITS.cardTitle) return;
      if (this.modalDescription.length > this.LIMITS.cardDesc) return;

      this.kanbanService.addCard(this.currentColumnId, this.modalTitle, this.modalDescription).subscribe({
        next: () => {
          this.zone.run(() => {
            this.loadColumns();
            this.closeModal();
          });
        },
        error: (err) => {
          console.error('Erro ao criar card:', err);
          this.zone.run(() => this.loadColumns());
        }
      });
    }
  }

  drop(event: CdkDragDrop<Card[]>, columnId: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const card = event.previousContainer.data[event.previousIndex];
      card.columnId = columnId;

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.kanbanService.updateCard(card).subscribe();
    }
  }

  deleteColumn(id: number | undefined) {
    if (id && confirm('Tem certeza que deseja excluir esta coluna?')) {
      this.kanbanService.deleteColumn(id).subscribe({
        next: () => this.zone.run(() => this.loadColumns()),
        error: (erro) => {
          console.error('Erro ao deletar coluna:', erro);
          this.zone.run(() => this.loadColumns());
        }
      });
    }
  }

  deleteCard(cardId: number) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.kanbanService.deleteCard(cardId).subscribe({
        next: () => {
          this.zone.run(() => this.loadColumns());
        },
        error: (err) => {
          console.error('Erro ao deletar card:', err);
          this.zone.run(() => this.loadColumns());
        }
      });
    }
  }
}