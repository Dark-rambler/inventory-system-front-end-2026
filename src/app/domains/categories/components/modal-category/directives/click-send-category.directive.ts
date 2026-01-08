import { Directive, inject, input } from '@angular/core';
import { CategoryService } from '../../../../../shared/services/category.service';
import { FormGroupDirective } from '@angular/forms';
import { Dialog } from '@angular/cdk/dialog';
import { tap } from 'rxjs';
import { CategoryResourceService } from '../../../services/categoryResource.service';

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

  onClick(): void {
    const form = this._formGroupDirective?.form;
    if (form?.valid) {
      this._createCategory();
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
      .subscribe();
  }
}
