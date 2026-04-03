import { Injectable, inject } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { ConfirmModalComponent } from '../components/confirm-modal/confirm-modal.component';
import { ConfirmModalResult } from '../components/confirm-modal';
import { Observable, Subject } from 'rxjs';

export interface ConfirmModalConfig {
  title?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmModalService {
  private readonly _dialog = inject(Dialog);

  public open(config: ConfirmModalConfig = {}): Observable<ConfirmModalResult> {
    const resultSubject = new Subject<ConfirmModalResult>();

    const dialogRef = this._dialog.open(ConfirmModalComponent, {
      data: {
        title: config.title ?? 'Confirmar acción',
        message: config.message ?? '¿Estás seguro de realizar esta acción?',
      },
      disableClose: true,
    });

    dialogRef.componentInstance?.confirm?.subscribe(result => {
      resultSubject.next(result);
      resultSubject.complete();
    });

    return resultSubject.asObservable();
  }
}
