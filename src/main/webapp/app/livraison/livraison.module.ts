import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { LIVRAISON_ROUTE } from './livraison.route';
import { LivraisonComponent } from './livraison-options/livraison.component';
import { ValidationComponent } from './validation/validation.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([LIVRAISON_ROUTE])],
  declarations: [LivraisonComponent, ValidationComponent],
})
export class LivraisonModule {}
