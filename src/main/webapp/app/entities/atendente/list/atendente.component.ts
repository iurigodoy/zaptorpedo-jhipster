import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAtendente } from '../atendente.model';
import { AtendenteService } from '../service/atendente.service';
import { AtendenteDeleteDialogComponent } from '../delete/atendente-delete-dialog.component';

@Component({
  selector: 'jhi-atendente',
  templateUrl: './atendente.component.html',
})
export class AtendenteComponent implements OnInit {
  atendentes?: IAtendente[];
  isLoading = false;

  constructor(protected atendenteService: AtendenteService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.atendenteService.query().subscribe(
      (res: HttpResponse<IAtendente[]>) => {
        this.isLoading = false;
        this.atendentes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAtendente): number {
    return item.id!;
  }

  delete(atendente: IAtendente): void {
    const modalRef = this.modalService.open(AtendenteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.atendente = atendente;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
