import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KanbanService, Column, Card } from './services/kanban';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DragDropModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  columns: Column[] = [];

  readonly INPUT_LIMITS = {
    columnTitleMaxLength: 20,
    cardTitleMaxLength: 50,
    cardDescriptionMaxLength: 200
  };

  isModalOpen = false;
  modalType: 'column' | 'card' = 'column';
  modalTitle = '';
  modalDescription = '';
  selectedColumnId?: number;
  isEditMode = false;
  selectedCardId?: number;

  isConfirmModalOpen = false;
  confirmDeleteType: 'column' | 'card' = 'column';
  itemToDeleteId?: number;

  constructor(
    private kanbanService: KanbanService,
    private changeDetector: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadColumns();
  }

  loadColumns(): void {
    this.kanbanService.getColumns().subscribe({
      next: (columns) => {
        this.ngZone.run(() => {
          this.columns = [...columns];
          this.changeDetector.markForCheck();
        });
      },
      error: (error) => console.error('Erro ao buscar colunas:', error)
    });
  }

  addColumn(): void {
    this.openModal('column');
  }

  addCardToFirstColumn(): void {
    if (this.columns.length > 0) {
      this.openModal('card', this.columns[0].id);
    }
  }

  openModal(type: 'column' | 'card', columnId?: number): void {
    this.modalType = type;
    this.selectedColumnId = columnId;
    this.modalTitle = '';
    this.modalDescription = '';
    this.isEditMode = false;
    this.selectedCardId = undefined;
    this.isModalOpen = true;
  }

  editCard(card: Card): void {
    this.modalType = 'card';
    this.selectedCardId = card.id;
    this.selectedColumnId = card.columnId;
    this.modalTitle = card.title;
    this.modalDescription = card.description || '';
    this.isEditMode = true;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  submitModal(): void {
    if (!this.modalTitle) return;

    if (this.modalType === 'column') {
      this.submitColumn();
    } else if (this.modalType === 'card') {
      this.submitCard();
    }
  }

  private submitColumn(): void {
    if (this.modalTitle.length > this.INPUT_LIMITS.columnTitleMaxLength) return;

    this.kanbanService.addColumn(this.modalTitle).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.loadColumns();
          this.closeModal();
        });
      },
      error: (error) => {
        console.error('Erro ao criar coluna:', error);
        this.ngZone.run(() => this.loadColumns());
      }
    });
  }

  private submitCard(): void {
    if (this.modalTitle.length > this.INPUT_LIMITS.cardTitleMaxLength) return;
    if (this.modalDescription.length > this.INPUT_LIMITS.cardDescriptionMaxLength) return;

    if (this.isEditMode && this.selectedCardId) {
      this.updateExistingCard();
    } else if (this.selectedColumnId !== undefined) {
      this.createNewCard();
    }
  }

  private updateExistingCard(): void {
    const updatedCard: Card = {
      id: this.selectedCardId,
      title: this.modalTitle,
      description: this.modalDescription,
      columnId: this.selectedColumnId!
    };

    this.kanbanService.updateCard(updatedCard).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.loadColumns();
          this.closeModal();
        });
      },
      error: (error) => {
        console.error('Erro ao editar card:', error);
        this.ngZone.run(() => this.loadColumns());
      }
    });
  }

  private createNewCard(): void {
    this.kanbanService.addCard(this.selectedColumnId!, this.modalTitle, this.modalDescription).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.loadColumns();
          this.closeModal();
        });
      },
      error: (error) => {
        console.error('Erro ao criar card:', error);
        this.ngZone.run(() => this.loadColumns());
      }
    });
  }

  onCardDrop(event: CdkDragDrop<Card[]>, columnId: number): void {
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

  requestDeleteColumn(id: number | undefined): void {
    if (id) {
      this.confirmDeleteType = 'column';
      this.itemToDeleteId = id;
      this.isConfirmModalOpen = true;
    }
  }

  requestDeleteCard(cardId: number): void {
    this.confirmDeleteType = 'card';
    this.itemToDeleteId = cardId;
    this.isConfirmModalOpen = true;
  }

  closeConfirmModal(): void {
    this.isConfirmModalOpen = false;
    this.itemToDeleteId = undefined;
  }

  confirmDelete(): void {
    if (!this.itemToDeleteId) return;

    if (this.confirmDeleteType === 'column') {
      this.kanbanService.deleteColumn(this.itemToDeleteId).subscribe({
        next: () => {
          this.ngZone.run(() => {
            this.loadColumns();
            this.closeConfirmModal();
          });
        },
        error: (error) => {
          console.error('Erro ao deletar coluna:', error);
          this.ngZone.run(() => this.loadColumns());
        }
      });
    } else {
      this.kanbanService.deleteCard(this.itemToDeleteId).subscribe({
        next: () => {
          this.ngZone.run(() => {
            this.loadColumns();
            this.closeConfirmModal();
          });
        },
        error: (error) => {
          console.error('Erro ao deletar card:', error);
          this.ngZone.run(() => this.loadColumns());
        }
      });
    }
  }
}