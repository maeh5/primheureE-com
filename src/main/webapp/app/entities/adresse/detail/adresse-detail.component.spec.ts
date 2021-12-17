import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AdresseDetailComponent } from './adresse-detail.component';

describe('Adresse Management Detail Component', () => {
  let comp: AdresseDetailComponent;
  let fixture: ComponentFixture<AdresseDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdresseDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ adresse: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AdresseDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AdresseDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load adresse on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.adresse).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
