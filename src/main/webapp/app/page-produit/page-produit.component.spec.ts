import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageProduitComponent } from './page-produit.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ProduitService } from '../entities/produit/service/produit.service';
import { FormBuilder } from '@angular/forms';

jest.mock('app/entities/produit/service/produit.service');

describe('DetailProductComponent', () => {
  let component: PageProduitComponent;
  let fixture: ComponentFixture<PageProduitComponent>;
  let mockActivatedRoute: ActivatedRoute;
  let mockProduitService: ProduitService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageProduitComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of([{ id: 1 }]),
          },
        },
        ProduitService,
      ],
    })
      .overrideTemplate(PageProduitComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageProduitComponent);
    component = fixture.componentInstance;
    mockActivatedRoute = TestBed.inject(ActivatedRoute);
    mockProduitService = TestBed.inject(ProduitService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
