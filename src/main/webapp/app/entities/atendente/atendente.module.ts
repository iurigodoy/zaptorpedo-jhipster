import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AtendenteComponent } from './list/atendente.component';
import { AtendenteDetailComponent } from './detail/atendente-detail.component';
import { AtendenteUpdateComponent } from './update/atendente-update.component';
import { AtendenteDeleteDialogComponent } from './delete/atendente-delete-dialog.component';
import { AtendenteRoutingModule } from './route/atendente-routing.module';

@NgModule({
  imports: [SharedModule, AtendenteRoutingModule],
  declarations: [AtendenteComponent, AtendenteDetailComponent, AtendenteUpdateComponent, AtendenteDeleteDialogComponent],
  entryComponents: [AtendenteDeleteDialogComponent],
})
export class AtendenteModule {}
