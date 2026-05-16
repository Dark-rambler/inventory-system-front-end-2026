import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { Customer } from '@shared/interfaces/customer.interface';
import { AuthService } from '@shared/services/auth.service';
import { BranchService } from '@shared/services/branch.service';
import { ConfirmModalService } from '@shared/services/confirm-modal.service';
import { getSelectedBranchIdFromStorage } from '@shared/utils/selected-branch-storage';
import { ToastrService } from 'ngx-toastr';
import { CustomerSaleModalComponent } from '../customer-sale-modal/customer-sale-modal.component';
import { CartPosService } from '../../services/cart-pos.service';

@Component({
  selector: 'app-cart-pos',
  imports: [CommonModule],
  templateUrl: './cart-pos.component.html',
})
export class CartPosComponent {
  private readonly _cartService = inject(CartPosService);
  private readonly _branchService = inject(BranchService);
  private readonly _authService = inject(AuthService);
  private readonly _confirmModalService = inject(ConfirmModalService);
  private readonly _toastr = inject(ToastrService);
  private readonly _dialog = inject(Dialog);
  protected readonly cart = this._cartService.cart;
  protected readonly subtotal = this._cartService.subtotal;
  protected readonly tax = this._cartService.tax;
  protected readonly total = this._cartService.total;
  protected readonly isEmpty = this._cartService.isEmpty;
  protected readonly saleProcessed = output<number>();
  protected isProcessing = false;

  removeFromCart(productId: string): void {
    this._cartService.removeFromCart(productId);
  }

  updateQuantity(productId: string, change: number): void {
    this._cartService.updateQuantity(productId, change);
  }

  clearCart(): void {
    this._cartService.clearCart();
  }

  processSale(): void {
    if (this.isEmpty() || this.isProcessing) return;

    const dialogRef = this._dialog.open(CustomerSaleModalComponent, {
      disableClose: true,
    });

    dialogRef.componentInstance?.customerConfirmed.subscribe(customer => {
      this._confirmSale(customer);
    });
  }

  private _confirmSale(customer: Customer): void {
    this._confirmModalService
      .open({
        title: 'Confirmar venta',
        message: `Cliente: ${customer.name}. Se procesara una venta por Bs ${this.total().toFixed(2)}. ¿Deseas continuar?`,
      })
      .subscribe(result => {
        if (result !== 'confirm') {
          return;
        }

        this._sendSaleRequest(customer);
        this._dialog.closeAll();
      });
  }

  private _sendSaleRequest(customer: Customer): void {
    if (this.isProcessing) return;

    const branchId = this._authService.selectedBranchId() ?? getSelectedBranchIdFromStorage();
    if (!branchId) {
      this._toastr.error('Selecciona una sucursal antes de procesar la venta', 'Sin sucursal');
      return;
    }

    const payload = {
      customerId: customer.id,
      saleDetails: this.cart().map(item => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    this.isProcessing = true;
    this._branchService.processSale(branchId, payload).subscribe({
      next: () => {
        const total = this.total();
        this._cartService.clearCart();
        this.saleProcessed.emit(total);
        this._toastr.success('Venta procesada correctamente', 'Éxito');
        this.isProcessing = false;
      },
      error: () => {
        this._toastr.error('No se pudo procesar la venta', 'Error');
        this.isProcessing = false;
      },
    });
  }
}
