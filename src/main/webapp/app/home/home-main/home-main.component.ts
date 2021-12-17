import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { IProduit } from '../../entities/produit/produit.model';
import { TypeProduit } from '../../entities/enumerations/type-produit.model';
import { FormBuilder } from '@angular/forms';
import { HomeService } from '../service/home.service';

@Component({
  selector: 'jhi-home',
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.scss'],
})
export class HomeMainComponent implements OnInit, OnDestroy {
  allProduct?: IProduit[];
  allTypes?: string[];

  typeForm = this.fb.group({
    type: [undefined],
    searchInput: [undefined],
  });

  account: Account | null = null;

  isLoading = false;

  currentPage = 0;

  allPage?: number[];

  private ngUnsubscribe = new Subject();

  private readonly destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private homeService: HomeService, private accountService: AccountService, private router: Router) {}

  ngOnInit(): void {
    this.allTypes = ['Tout'].concat(Object.values(TypeProduit)); // Types de produits + "Tout"
    this.loadProduit();

    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeFiltre(): void {
    this.currentPage = 0;
    this.loadProduit();
  }

  loadProduit(): void {
    this.isLoading = true;

    const valType = this.typeForm.get('type')!.value === 'Tout' ? null : this.typeForm.get('type')!.value; // On passe à null pour "Tout" --> permet avoir tous les types
    const valSearch = this.typeForm.get('searchInput')!.value;

    this.homeService.findByTypeAndName(valType, valSearch, this.currentPage).subscribe(
      res => {
        this.isLoading = false;
        this.allProduct = res.body?.content ?? [];
        this.allPage = [];
        for (let i = 0; i < res.body!.totalPages; i++) {
          this.allPage.push(i);
        }
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  changePage(num: number): void {
    if (num >= 0 && num < this.allPage!.length) {
      this.currentPage = num;
      this.loadProduit();
    }
  }
}
