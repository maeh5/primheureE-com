import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { UserExtraService } from '../service/user-extra.service';

import { UserExtraComponent } from './user-extra.component';

describe('UserExtra Management Component', () => {
  let comp: UserExtraComponent;
  let fixture: ComponentFixture<UserExtraComponent>;
  let service: UserExtraService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UserExtraComponent],
    })
      .overrideTemplate(UserExtraComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserExtraComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserExtraService);

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
    expect(comp.userExtras?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
