import { Routes } from '@angular/router';
import { EditarCursoModalComponent } from './components/editar-curso-modal/editar-curso-modal.component';

export const routes: Routes = [
  {
    path: 'editar-curso',
    component: EditarCursoModalComponent,
    data: { isEditando: true }
  }
];
