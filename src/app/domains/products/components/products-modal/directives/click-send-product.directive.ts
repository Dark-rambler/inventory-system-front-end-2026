import { DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import { Directive, inject, input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { Product } from '../../../../../shared/interfaces/product.interface';
import { ProductService } from '../../../../../shared/services/product.service';
import { ProductResourceService } from '../../../services/product-resource.service';

interface ProductFormPayload {
  name: string;
  description: string;
  code: string;
  categoryId: string | number;
}

@Directive({
  selector: '[appSendProduct]',
  host: {
    '(click)': 'onClick()',
  },
})
export class SendProductDirective {
  public keepOpen = input<boolean>(false);

  private readonly _productService = inject(ProductService);
  private readonly _formGroupDirective = inject(FormGroupDirective, { optional: true });
  private readonly _dialog = inject(Dialog);
  private readonly _productResourceService = inject(ProductResourceService);
  private readonly _toastrService = inject(ToastrService);
  protected data = inject(DIALOG_DATA);

  public onClick(): void {
    const form = this._formGroupDirective?.form;

    if (form?.valid) {
      if (this.data) {
        this._updateProduct();
      } else {
        this._createProduct();
      }

      return;
    }

    form?.markAllAsTouched();
  }

  private _createProduct(): void {
    const form = this._formGroupDirective?.form;
    const payload = this._buildPayload();

    if (!payload) {
      return;
    }

    this._productService
      .create(payload as unknown as Product)
      .pipe(
        tap(() => this._productResourceService.reloadProduct()),
        tap(() => (this.keepOpen() ? form?.reset() : this._dialog.closeAll()))
      )
      .subscribe({
        next: () => {
          this._toastrService.success('Producto creado correctamente.', 'Exito');
        },
        error: error => {
          this._toastrService.error(error?.message || 'No se pudo crear el producto.', 'Error');
        },
      });
  }

  private _updateProduct(): void {
    const form = this._formGroupDirective?.form;
    const payload = this._buildPayload();

    if (!payload) {
      return;
    }

    this._productService
      .update(payload as unknown as Product, String(this.data.id))
      .pipe(
        tap(() => this._productResourceService.reloadProduct()),
        tap(() => (this.keepOpen() ? form?.reset() : this._dialog.closeAll()))
      )
      .subscribe({
        next: () => {
          this._toastrService.success('Producto actualizado correctamente.', 'Exito');
        },
        error: () => {
          this._toastrService.error('No se pudo actualizar el producto.', 'Error');
        },
      });
  }

  private _buildPayload(): ProductFormPayload | null {
    const formValue = this._formGroupDirective?.form?.value as {
      name: string;
      description: string;
      code: string;
      categoryId: string | number;
    } | null;

    if (!formValue) {
      return null;
    }

    return {
      name: formValue.name,
      description: formValue.description,
      code: formValue.code,
      categoryId: this._normalizeCategoryId(formValue.categoryId),
    };
  }

  private _normalizeCategoryId(value: string | number): string | number {
    const normalized = Number(value);
    return Number.isNaN(normalized) ? value : normalized;
  }
}
