import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { PageProduitComponent } from './page-produit.component';
import { PAGE_PRODUIT_ROUTE } from './page-produit.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(PAGE_PRODUIT_ROUTE)],
  declarations: [PageProduitComponent],
})
export class PageProduitModule {}
