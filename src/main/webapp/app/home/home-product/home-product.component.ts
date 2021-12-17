import { Component, Input } from '@angular/core';
import { IProduit } from '../../entities/produit/produit.model';

@Component({
  selector: 'jhi-home-product',
  templateUrl: './home-product.component.html',
  styleUrls: ['./home-product.component.scss'],
})
export class HomeProductComponent {
  @Input() product: IProduit | undefined;
}
