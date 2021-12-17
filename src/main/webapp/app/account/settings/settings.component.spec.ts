import { AdresseService } from '../../entities/adresse/service/adresse.service';

jest.mock('app/core/auth/account.service');
jest.mock('app/core/auth/state-storage.service');
jest.mock('@angular/router');

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { throwError, of } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

import { SettingsComponent } from './settings.component';
import { CarteBancaireService } from '../../entities/carte-bancaire/service/carte-bancaire.service';
import { UserExtraService } from '../../entities/user-extra/service/user-extra.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { Router } from '@angular/router';

describe('SettingsComponent', () => {
  let comp: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let mockAccountService: AccountService;
  let mockAdresseService: AdresseService;
  let mockCarteBancaireService: CarteBancaireService;
  let mockUserExtraService: UserExtraService;
  const account: Account = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    activated: true,
    email: 'john.doe@mail.com',
    langKey: 'fr',
    login: 'john',
    authorities: [],
    imageUrl: '',
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SettingsComponent],
        providers: [FormBuilder, StateStorageService, AccountService, Router],
      })
        .overrideTemplate(SettingsComponent, '')
        .compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    comp = fixture.componentInstance;
    mockAccountService = TestBed.inject(AccountService);
    mockAdresseService = TestBed.inject(AdresseService);
    mockCarteBancaireService = TestBed.inject(CarteBancaireService);
    mockUserExtraService = TestBed.inject(UserExtraService);
    mockAccountService.identity = jest.fn(() => of(account));
    mockAccountService.getAuthenticationState = jest.fn(() => of(account));
  });

  it('should send the current identity upon save', () => {
    // GIVEN
    mockAccountService.save = jest.fn(() => of({}));
    const settingsFormValues = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
      adresse: null,
      carteBancaire: null,
      codePostal: null,
      ville: null,
    };

    // WHEN
    comp.ngOnInit();
    comp.save();

    // THEN
    expect(mockAccountService.identity).toHaveBeenCalled();
    expect(mockAccountService.save).toHaveBeenCalledWith(account);
    expect(mockAccountService.authenticate).toHaveBeenCalledWith(account);
    expect(comp.settingsForm.value).toEqual(settingsFormValues);
  });

  it('should notify of success upon successful save', () => {
    // GIVEN
    mockAccountService.save = jest.fn(() => of({}));

    // WHEN
    comp.ngOnInit();
    comp.save();

    // THEN
    expect(comp.success).toBe(true);
  });

  it('should notify of error upon failed save', () => {
    // GIVEN
    mockAccountService.save = jest.fn(() => throwError('ERROR'));

    // WHEN
    comp.ngOnInit();
    comp.save();

    // THEN
    expect(comp.success).toBe(false);
  });
});
