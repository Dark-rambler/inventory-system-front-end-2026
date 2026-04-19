import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { Directive, inject, input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { CategoryService } from '../../../../../shared/services/category.service';
import { CategoryResourceService } from '../../../services/category-resource.service';

@Directive({
  selector: '[appSendCategory]',
  standalone: true,
  host: {
    '(click)': 'onClick()',
  },
})
export class SendCategoryDirective {
  public keepOpen = input<boolean>(false);
  private readonly _categoryService = inject(CategoryService);
  private readonly _formGroupDirective = inject(FormGroupDirective, { optional: true });
  private readonly _dialog = inject(Dialog);
  private readonly _categoryResourceService = inject(CategoryResourceService);
  private readonly _toastrService = inject(ToastrService);
  protected data = inject(DIALOG_DATA);

  onClick(): void {
    const form = this._formGroupDirective?.form;
    if (form?.valid) {
      if (this.data) {
        this._updateCategory();
      } else {
        this._createCategory();
      }
    } else {
      form?.markAllAsTouched();
    }
  }

  private _createCategory(): void {
    const form = this._formGroupDirective?.form;
    const category = form?.value;
    this._categoryService
      .create(category)
      .pipe(
        tap(() => this._categoryResourceService.reloadCategory()),
        tap(() => (this.keepOpen() ? form?.reset() : this._dialog.closeAll()))
      )
      .subscribe({
        next: () => {
          this._toastrService.success('Categoria creada correctamente.', 'Exito');
        },
        error: error => {
          this._toastrService.error(error?.message || 'No se pudo crear la categoria.', 'Error');
        },
      });
  }

  private _updateCategory(): void {
    const form = this._formGroupDirective?.form;
    const category = form?.value;

    this._categoryService
      .update(category, this.data.id)
      .pipe(
        tap(() => this._categoryResourceService.reloadCategory()),
        tap(() => (this.keepOpen() ? form?.reset() : this._dialog.closeAll()))
      )
      .subscribe({
        next: () => {
          this._toastrService.success('Categoria actualizada correctamente.', 'Exito');
        },
        error: () => {
          this._toastrService.error('No se pudo actualizar la categoria.', 'Error');
        },
      });
  }
}
