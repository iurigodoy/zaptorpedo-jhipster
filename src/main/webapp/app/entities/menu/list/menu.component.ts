import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMenu } from '../menu.model';
import { MenuService } from '../service/menu.service';
import { MenuDeleteDialogComponent } from '../delete/menu-delete-dialog.component';

@Component({
  selector: 'jhi-menu',
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit {
  menus?: IMenu[];
  isLoading = false;

  constructor(protected menuService: MenuService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.menuService.query().subscribe(
      (res: HttpResponse<IMenu[]>) => {
        this.isLoading = false;
        this.menus = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IMenu): number {
    return item.id!;
  }

  delete(menu: IMenu): void {
    const modalRef = this.modalService.open(MenuDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.menu = menu;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
