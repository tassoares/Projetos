import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
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
  closeAddModal() {

  }
  confirmAddCourse() {
    console.log(this.os);
  }

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe(data => {
      this.isEditando = data['isEditando'];
    });
  }

  @Input() isEditando: boolean = true;
  @Output() fecharModal = new EventEmitter<void>();

  // Método para fechar o modal
  fechar() {
    this.fecharModal.emit();
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
            pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
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
