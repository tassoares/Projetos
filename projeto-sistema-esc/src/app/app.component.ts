import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { EditarCursoModalComponent } from './components/editar-curso-modal/editar-curso-modal.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, RouterOutlet, CommonModule, EditarCursoModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  editandoCurso = false;
  selectedStatus: string = 'todos';
  selectedYear: string = 'todos';
  editando = false;
  editarCurso() {
    this.editandoCurso = true;
  }
  carregando = true;
  constructor(private http: HttpClient) { }

  listaCursos: any;
  listaCursosBackup: any;

  async ngOnInit() {
    this.carregarDados();
  }


  async carregarDados() {
    this.carregando = true;
    setTimeout(async () => {
      var res: any = await this.http
        .get('http://localhost:3000/listaCursos?_sort=id')
        .toPromise();
      this.listaCursos = res;
      this.listaCursosBackup = res;
      console.log(this.listaCursos);
      this.carregando = false;
    }, 500);
  }

  title = 'cursos';

  courseIdToDelete = '';
  nextCourseNumber = 1;
  excluirCurso = false;

  openModal(courseId: any) {
    this.courseIdToDelete = courseId;
    const modal = document.getElementById('modal');
  }
  modalVisivel = false;
  openAddModal() {
    this.numeroCurso = '';
    this.nomeCurso = '';
    this.statusCurso = '';
    this.dataInicio = '';
    this.dataTermino = '';
    this.modalVisivel = true;
  }

  closeModal() {
    const modal = document.getElementById('modal');
    //   modal.style.display = 'none';
  }

  closeAddModal() {
    this.modalVisivel = false;
  }

  deleteCourse() {
    if (this.courseIdToDelete) {
      const courseElement = document.getElementById(this.courseIdToDelete);
      if (courseElement) {
        courseElement.remove();
        this.closeModal();
      }
    }
  }

  numeroCurso = '';
  nomeCurso = '';
  dataInicio = '';
  dataTermino = '';
  statusCurso = '';

  pesquisarCurso(texto: string) {
    this.listaCursos = this.listaCursosBackup;
    let cursosFiltrados = this.listaCursos.filter(
      (curso: { nomeCurso: string }) =>
        curso.nomeCurso.toLowerCase().includes(texto.toLowerCase())
    );
    this.listaCursos = cursosFiltrados;
  }

  textoPesquisa = '';

  sortCursos(attribute: string) {
    this.listaCursos = this.listaCursosBackup;
    this.listaCursos.sort((a: { [x: string]: number; }, b: { [x: string]: number; }) => {
      if (a[attribute] < b[attribute]) {
        return -1;
      } else if (a[attribute] > b[attribute]) {
        return 1;
      } else {
        return 0;
      }
    });

  }

  filterCursos() {
    this.listaCursos = this.listaCursosBackup;
    if (this.selectedStatus != 'Todos') {
      console.log(this.selectedStatus)
      this.listaCursos = this.listaCursos.filter((curso: { status: string; }) => {
        return curso.status === this.selectedStatus;
      });
    }
    if (this.selectedYear != 'Todos') {
      console.log(this.selectedYear)
      this.listaCursos = this.listaCursos.filter((curso: { dataInicio: string | number | Date; }) => {
        const year = new Date(curso.dataInicio).getFullYear();
        return year.toString() === this.selectedYear;
      });
    }
    console.log(this.listaCursos)
  }



  async salvaCurso(os: any) {
    console.log(os);
    var res = await this.http
      .post('http://localhost:3000/listaCursos', os)
      .toPromise();
  }

  async deletaCurso(id: any) {
    var res = await this.http
      .delete(`http://localhost:3000/listaCursos/${id}`)
      .toPromise();
  }
  fecharModal() {
    this.editando = false;
    this.modalVisivel = false;

  }
  os = {
    unidadeSolicitante: '',
    tituloEvento: '',
    dataInicio: '',
    horaInicio: '',
    dataFim: '',
    horaFim: '',
    quantidadeParticipantes: '',
    modalidade: '', // Dropdown com opções predefinidas
    cargaHoraria: '',
    demanda: '', // Dropdown com opções predefinidas
    coordenadorGeral: '', // Dropdown com opções predefinidas
    coordenadorApoioInstitucional: '', // Dropdown com opções predefinidas
    coordenadorAcaoCapacitacao: '',
    coordenacaoApoioAcao: '',
    coordenacaoApoioOperacional: '',
    equipeTecnica: '',
    equipeTecnica2: '',
    equipeTecnica3: '',
    equipeTecnica4: '',
    equipeJuridica: '',
    observacao: '',
    osElaboradaPor: '',
    local: '',
    publicoAlvo: '',
  };


  async confirmAddCourse() {
    this.modalVisivel = false;
    this.salvaCurso(this.os);
    this.carregarDados();

    // if (this.numeroCurso && this.nomeCurso && this.dataInicio && this.dataTermino && statusCurso) {
    //   const cursosAdicionados = document.getElementById('cursos-adicionados');
    //   const formattedDataInicio = new Date(this.dataInicio).toLocaleDateString(
    //     'pt-BR'
    //   );
    //   const formattedDataTermino = new Date(this.dataTermino).toLocaleDateString(
    //     'pt-BR'
    //   );
    //   const novoCurso = `
    //             <div class="course-card" id="curso-${this.numeroCurso}">
    //                 <span class="course-number">${this.numeroCurso}.</span>
    //                 <span class="dot ${this.statusCurso}"></span>
    //                 <span class="status">${
    //                   this.statusCurso === 'andamento'
    //                     ? 'Em andamento'
    //                     : this.statusCurso.charAt(0).toUpperCase() +
    //                       this.statusCurso.slice(1)
    //                 }</span>
    //                 <span class="course-name">${this.nomeCurso}</span>
    //                 <span class="course-dates">${formattedDataInicio} - ${formattedDataTermino}</span>
    //                 <a href="#" class="edit-link">Editar</a>
    //                 <a href="#" class="delete-link" onclick="openModal('curso-${this.numeroCurso}')">x</a>
    //             </div>
    //         `;
    //   cursosAdicionados.insertAdjacentHTML('afterbegin', novoCurso);
    //   // Incrementa o número do próximo curso automaticamente
    //   this.nextCourseNumber = parseInt(this.numeroCurso) + 1;
    //   this.closeAddModal();
    // } else {
    //   alert('Por favor, preencha todos os campos para adicionar o curso.');
    // }
  }
}
