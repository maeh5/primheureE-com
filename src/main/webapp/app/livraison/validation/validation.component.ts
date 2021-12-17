import { Component, Input } from '@angular/core';
import { ICarteBancaire } from '../../entities/carte-bancaire/carte-bancaire.model';
import { IAdresse } from '../../entities/adresse/adresse.model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { PanierService } from 'app/panier/panier.service';

@Component({
  selector: 'jhi-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss'],
})
export class ValidationComponent {
  @Input() adresse?: IAdresse;
  @Input() moyenPaiement?: string;
  @Input() carteBancaire?: ICarteBancaire;
  @Input() dateLivraison?: NgbDateStruct;
  @Input() heureLivraison?: { hour: number; minute: number };

  constructor(private panierService: PanierService) {}

  getPrixTotal(): number {
    return this.panierService.getPrixTotal();
  }
}
