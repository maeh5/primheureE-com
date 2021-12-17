import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { CarteBancaire } from '../../entities/carte-bancaire/carte-bancaire.model';
import { Adresse } from '../../entities/adresse/adresse.model';
import { UserExtra } from '../../entities/user-extra/user-extra.model';
import { UserExtraService } from '../../entities/user-extra/service/user-extra.service';
import { AdresseService } from '../../entities/adresse/service/adresse.service';
import { CarteBancaireService } from '../../entities/carte-bancaire/service/carte-bancaire.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  account!: Account;
  success = false;
  userExtra!: UserExtra;
  previousUrl!: string;
  settingsForm = this.fb.group({
    firstName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    lastName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    email: [undefined, [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    adresse: [undefined, [Validators.required, Validators.minLength(5), Validators.maxLength(254)]],
    codePostal: [undefined, [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
    ville: [undefined, [Validators.required, Validators.minLength(5), Validators.maxLength(254)]],
    carteBancaire: [undefined, [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
  });

  constructor(
    private adresseService: AdresseService,
    private carteBancaireService: CarteBancaireService,
    private userExtraService: UserExtraService,
    private accountService: AccountService,
    private fb: FormBuilder,
    private stateStorageService: StateStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.previousUrl = this.stateStorageService.getUrl()!;
    this.stateStorageService.clearUrl();
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.settingsForm.patchValue({
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
        });

        this.account = account;
      }
    });

    this.userExtraService.find(this.account.id).subscribe(userExtra => {
      this.userExtra = userExtra.body!;

      this.settingsForm.patchValue({
        adresse: this.userExtra.adresses![0].adresse, // TODO: gerer tableau d adresse
        codePostal: this.userExtra.adresses![0].codePostal,
        ville: this.userExtra.adresses![0].ville,
        carteBancaire: this.userExtra.cartesBancaires![0].numero, // TODO: gerer tableau carte bancaire
      });
    });
  }

  redirect(): void {
    if (this.previousUrl) {
      this.router.navigateByUrl(this.previousUrl);
    } else {
      this.router.navigateByUrl('/');
    }
  }

  save(): void {
    this.success = false;

    this.account.firstName = this.settingsForm.get('firstName')!.value;
    this.account.lastName = this.settingsForm.get('lastName')!.value;
    this.account.email = this.settingsForm.get('email')!.value;

    const cartesBancaires = [{ ...new CarteBancaire(), numero: this.settingsForm.get('carteBancaire')!.value, userExtra: this.userExtra }];

    const adresses = [
      {
        ...new Adresse(),
        adresse: this.settingsForm.get('adresse')!.value,
        codePostal: this.settingsForm.get('codePostal')!.value,
        ville: this.settingsForm.get('ville')!.value,
        userExtra: this.userExtra,
      },
    ];

    this.accountService.save(this.account).subscribe(() => {
      this.success = true;

      this.accountService.authenticate(this.account);

      try {
        if (this.userExtra.adresses?.length === 0) {
          this.adresseService.create(adresses[0]).subscribe(() => {
            this.success &&= true;
            this.carteBancaireService.create(cartesBancaires[0]).subscribe(() => {
              this.success &&= true;
              this.redirect();
            });
          });
        } else {
          // On supprime l'adresse et la CB précédente afin de rester cohérent
          // avec le contenu de la BD et l'affichage. On ne gère donc qu'une
          // seule adresse/CB à la fois.
          // A supprimer si on veut gerer plusieurs adresses/CBs
          /* */
          this.adresseService.delete(this.userExtra.adresses![0].id!);
          this.carteBancaireService.delete(this.userExtra.cartesBancaires![0].id!);
          /* */

          adresses[0].id = this.userExtra.adresses![0].id;
          cartesBancaires[0].id = this.userExtra.cartesBancaires![0].id;
          this.adresseService.partialUpdate(adresses[0]).subscribe(() => {
            this.success &&= true;
            this.carteBancaireService.partialUpdate(cartesBancaires[0]).subscribe(() => {
              this.success &&= true;
              this.redirect();
            });
          });
        }
      } catch (e) {
        console.error("can't read undefined address");
      }
    });
  }
}
