import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
// 1. Importamos a ferramenta de requisições HTTP
import { provideHttpClient } from '@angular/common/http'; 

export const appConfig: ApplicationConfig = {
  // 2. Colocamos ela aqui dentro dos providers
  providers: [provideRouter(routes), provideHttpClient()] 
};