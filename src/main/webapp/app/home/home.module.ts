import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeMainComponent } from './home-main/home-main.component';
import { HomeProductComponent } from './home-product/home-product.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(HOME_ROUTE)],
  declarations: [HomeMainComponent, HomeProductComponent],
})
export class HomeModule {}
