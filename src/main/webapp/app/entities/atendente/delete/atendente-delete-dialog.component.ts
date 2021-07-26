import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAtendente } from '../atendente.model';
import { AtendenteService } from '../service/atendente.service';

@Component({
  templateUrl: './atendente-delete-dialog.component.html',
})
export class AtendenteDeleteDialogComponent {
  atendente?: IAtendente;

  constructor(protected atendenteService: AtendenteService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.atendenteService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
