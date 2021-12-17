jest.mock('app/home/service/home.service');
jest.mock('app/core/auth/account.service');
jest.mock('@angular/router');

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

import { HomeMainComponent } from './home-main.component';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { pageProduit } from './page-produit.model';
import { HomeService } from '../service/home.service';

describe('Home Component', () => {
  let comp: HomeMainComponent;
  let fixture: ComponentFixture<HomeMainComponent>;
  let mockAccountService: AccountService;
  let mockRouter: Router;
  let mockHomeService: HomeService;
  let mockFormBuilder: FormBuilder;
  const account: Account = {
    id: 1,
    activated: true,
    authorities: [],
    email: '',
    firstName: null,
    langKey: '',
    lastName: null,
    login: 'login',
    imageUrl: null,
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HomeMainComponent],
        providers: [HomeService, AccountService, Router, FormBuilder],
      })
        .overrideTemplate(HomeMainComponent, '')
        .compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeMainComponent);
    comp = fixture.componentInstance;
    mockHomeService = TestBed.inject(HomeService);

    const headers = new HttpHeaders();
    jest.spyOn(mockHomeService, 'findByTypeAndName').mockReturnValue(
      of(
        new HttpResponse({
          body: new pageProduit(),
          headers,
        })
      )
    );
    mockFormBuilder = TestBed.inject(FormBuilder);
    mockAccountService = TestBed.inject(AccountService);
    mockAccountService.identity = jest.fn(() => of(null));
    mockAccountService.getAuthenticationState = jest.fn(() => of(null));
    mockRouter = TestBed.inject(Router);
  });

  describe('ngOnInit', () => {
    it('Should synchronize account variable with current account', () => {
      // GIVEN
      const authenticationState = new Subject<Account | null>();
      mockAccountService.getAuthenticationState = jest.fn(() => authenticationState.asObservable());

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.account).toBeNull();

      // WHEN
      authenticationState.next(account);

      // THEN
      expect(comp.account).toEqual(account);

      // WHEN
      authenticationState.next(null);

      // THEN
      expect(comp.account).toBeNull();
    });
  });

  describe('login', () => {
    it('Should navigate to /login on login', () => {
      // WHEN
      comp.login();

      // THEN
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('ngOnDestroy', () => {
    it('Should destroy authentication state subscription on component destroy', () => {
      // GIVEN
      const authenticationState = new Subject<Account | null>();
      mockAccountService.getAuthenticationState = jest.fn(() => authenticationState.asObservable());

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.account).toBeNull();

      // WHEN
      authenticationState.next(account);

      // THEN
      expect(comp.account).toEqual(account);

      // WHEN
      comp.ngOnDestroy();
      authenticationState.next(null);

      // THEN
      expect(comp.account).toEqual(account);
    });
  });
});
