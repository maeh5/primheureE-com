import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AdresseComponent } from './list/adresse.component';
import { AdresseDetailComponent } from './detail/adresse-detail.component';
import { AdresseUpdateComponent } from './update/adresse-update.component';
import { AdresseDeleteDialogComponent } from './delete/adresse-delete-dialog.component';
import { AdresseRoutingModule } from './route/adresse-routing.module';

@NgModule({
  imports: [SharedModule, AdresseRoutingModule],
  declarations: [AdresseComponent, AdresseDetailComponent, AdresseUpdateComponent, AdresseDeleteDialogComponent],
  entryComponents: [AdresseDeleteDialogComponent],
})
export class AdresseModule {}
