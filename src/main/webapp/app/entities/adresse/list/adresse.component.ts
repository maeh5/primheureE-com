import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAdresse } from '../adresse.model';
import { AdresseService } from '../service/adresse.service';
import { AdresseDeleteDialogComponent } from '../delete/adresse-delete-dialog.component';

@Component({
  selector: 'jhi-adresse',
  templateUrl: './adresse.component.html',
})
export class AdresseComponent implements OnInit {
  adresses?: IAdresse[];
  isLoading = false;

  constructor(protected adresseService: AdresseService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.adresseService.query().subscribe(
      (res: HttpResponse<IAdresse[]>) => {
        this.isLoading = false;
        this.adresses = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAdresse): number {
    return item.id!;
  }

  delete(adresse: IAdresse): void {
    const modalRef = this.modalService.open(AdresseDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.adresse = adresse;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
