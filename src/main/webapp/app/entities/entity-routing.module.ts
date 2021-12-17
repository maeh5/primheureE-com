import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'produit',
        data: { pageTitle: 'Produits' },
        loadChildren: () => import('./produit/produit.module').then(m => m.ProduitModule),
      },
      {
        path: 'user-extra',
        data: { pageTitle: 'UserExtras' },
        loadChildren: () => import('./user-extra/user-extra.module').then(m => m.UserExtraModule),
      },
      {
        path: 'commande',
        data: { pageTitle: 'Commandes' },
        loadChildren: () => import('./commande/commande.module').then(m => m.CommandeModule),
      },
      {
        path: 'detail-produit-commande',
        data: { pageTitle: 'DetailProduitCommandes' },
        loadChildren: () => import('./detail-produit-commande/detail-produit-commande.module').then(m => m.DetailProduitCommandeModule),
      },
      {
        path: 'categorie',
        data: { pageTitle: 'Categories' },
        loadChildren: () => import('./categorie/categorie.module').then(m => m.CategorieModule),
      },
      {
        path: 'adresse',
        data: { pageTitle: 'Adresses' },
        loadChildren: () => import('./adresse/adresse.module').then(m => m.AdresseModule),
      },
      {
        path: 'carte-bancaire',
        data: { pageTitle: 'CarteBancaires' },
        loadChildren: () => import('./carte-bancaire/carte-bancaire.module').then(m => m.CarteBancaireModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
