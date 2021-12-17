import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { PANIER_ROUTE } from './panier.route';
import { PanierComponent } from './panier.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(PANIER_ROUTE)],
  declarations: [PanierComponent],
})
export class PanierModule {}
