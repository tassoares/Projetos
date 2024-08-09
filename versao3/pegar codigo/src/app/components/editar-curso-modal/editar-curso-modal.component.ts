import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-editar-curso-modal',
  standalone: true,
  imports: [FormsModule, RouterOutlet, CommonModule, EditarCursoModalComponent],
  templateUrl: './editar-curso-modal.component.html',
  styleUrl: './editar-curso-modal.component.scss',
})
export class EditarCursoModalComponent {
  closeAddModal() {}
  confirmAddCourse() {
    console.log(this.os);
  }

  async ngOnInit() {
    await this.carregarDadoCursoEditando();
  }

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.data.subscribe((data) => {
      this.isEditando = data['isEditando'];
    });
  }

  @Input() isEditando: boolean = true;
  @Input() idCurso: string = '';
  @Output() fecharModal = new EventEmitter<void>();
  @Output() sinalizaReloadPage = new EventEmitter<void>();

  async carregarDadoCursoEditando() {
    console.log(this.idCurso);
    let res: any = await this.http
      .get(`http://localhost:3000/listaCursos/` + this.idCurso)
      .toPromise();
    console.log(res);
    this.os = res;
  }

carregando = false;
  recarregaPagina() {
    setTimeout(() => {
      this.carregando = true;
      this.sinalizaReloadPage.emit();
      window.location.reload();
      this.fechar();
      this.carregando = false;
    }, 700);
  }

  // Método para fechar o modal
  fechar() {
    this.fecharModal.emit();
  }

  async salvaCurso(os: any) {
    console.log(os);
    if (this.isEditando) {
      var res = await this.http
        .put('http://localhost:3000/listaCursos/' + os.id, os)
        .toPromise();
    } else {
      delete os.id;
      var res = await this.http
        .post('http://localhost:3000/listaCursos', os)
        .toPromise();
    }
  }

  os = {
    id: '',
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

  @ViewChild('dataToExport', { static: false })
  public dataToExport!: ElementRef;

  title = 'export-pdf';
  imprimir = false;
  salvarRelatorio() {
    this.imprimir = true;
    setTimeout(() => {
      const data = document.getElementById('dataToExport');
      if (data) {
        html2canvas(data).then((canvas) => {
          const imgWidth = 210; // Largura em mm (A4)
          const pageHeight = 297; // Altura em mm (A4)
          let imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;

          const contentDataURL = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          let position = 0;

          pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(
              contentDataURL,
              'PNG',
              0,
              position,
              imgWidth,
              imgHeight
            );
            heightLeft -= pageHeight;
          }

          pdf.save('relatorio.pdf');
          setTimeout(() => {
            this.imprimir = false;
          }, 750);
        });
      }
    }, 2000);
  }
}
