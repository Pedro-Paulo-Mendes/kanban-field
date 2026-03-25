import { TestBed } from '@angular/core/testing';
import { KanbanService } from './kanban';

describe('KanbanService', () => {
  let service: KanbanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KanbanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
