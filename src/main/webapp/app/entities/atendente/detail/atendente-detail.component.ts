import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAtendente } from '../atendente.model';

@Component({
  selector: 'jhi-atendente-detail',
  templateUrl: './atendente-detail.component.html',
})
export class AtendenteDetailComponent implements OnInit {
  atendente: IAtendente | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ atendente }) => {
      this.atendente = atendente;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
