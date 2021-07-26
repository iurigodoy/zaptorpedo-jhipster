import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'company',
        data: { pageTitle: 'zaptorpedoApp.company.home.title' },
        loadChildren: () => import('./company/company.module').then(m => m.CompanyModule),
      },
      {
        path: 'atendente',
        data: { pageTitle: 'zaptorpedoApp.atendente.home.title' },
        loadChildren: () => import('./atendente/atendente.module').then(m => m.AtendenteModule),
      },
      {
        path: 'message',
        data: { pageTitle: 'zaptorpedoApp.message.home.title' },
        loadChildren: () => import('./message/message.module').then(m => m.MessageModule),
      },
      {
        path: 'campaign',
        data: { pageTitle: 'zaptorpedoApp.campaign.home.title' },
        loadChildren: () => import('./campaign/campaign.module').then(m => m.CampaignModule),
      },
      {
        path: 'whats-app-source-phone-number',
        data: { pageTitle: 'zaptorpedoApp.whatsAppSourcePhoneNumber.home.title' },
        loadChildren: () =>
          import('./whats-app-source-phone-number/whats-app-source-phone-number.module').then(m => m.WhatsAppSourcePhoneNumberModule),
      },
      {
        path: 'menu',
        data: { pageTitle: 'zaptorpedoApp.menu.home.title' },
        loadChildren: () => import('./menu/menu.module').then(m => m.MenuModule),
      },
      {
        path: 'campaign-execution',
        data: { pageTitle: 'zaptorpedoApp.campaignExecution.home.title' },
        loadChildren: () => import('./campaign-execution/campaign-execution.module').then(m => m.CampaignExecutionModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
