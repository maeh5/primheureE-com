import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AdresseService } from '../service/adresse.service';

import { AdresseComponent } from './adresse.component';

describe('Adresse Management Component', () => {
  let comp: AdresseComponent;
  let fixture: ComponentFixture<AdresseComponent>;
  let service: AdresseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AdresseComponent],
    })
      .overrideTemplate(AdresseComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AdresseComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AdresseService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.adresses?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
