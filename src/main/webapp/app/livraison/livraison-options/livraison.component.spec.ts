jest.mock('@angular/router');
jest.mock('app/core/auth/state-storage.service');
jest.mock('app/core/auth/account.service');

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { UserExtraService } from 'app/entities/user-extra/service/user-extra.service';
import { LivraisonComponent } from './livraison.component';

describe('LivraisonComponent', () => {
  let component: LivraisonComponent;
  let fixture: ComponentFixture<LivraisonComponent>;
  let mockRouter: Router;
  let mockAccountService: AccountService;
  let mockUserExtraService: UserExtraService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LivraisonComponent],
      providers: [FormBuilder, StateStorageService, AccountService, Router],
    })
      .overrideTemplate(LivraisonComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LivraisonComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router);
    mockAccountService = TestBed.inject(AccountService);
    mockUserExtraService = TestBed.inject(UserExtraService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
