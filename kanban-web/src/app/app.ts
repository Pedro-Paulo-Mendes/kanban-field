import { Component, OnInit } from '@angular/core';
import { KanbanService, Column } from './services/kanban'; 

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  columns: Column[] = [];

  constructor(private kanbanService: KanbanService) {}

  ngOnInit() {
    this.kanbanService.getColumns().subscribe({
      next: (dados) => {
        // 👉 CÂMERA DE SEGURANÇA AQUI:
        console.log('🕵️‍♂️ DADOS QUE CHEGARAM DO BACKEND:', dados); 
        
        this.columns = dados;
      },
      error: (erro) => {
        console.error('Ops! Erro ao buscar os dados:', erro);
      }
    });
  }
}