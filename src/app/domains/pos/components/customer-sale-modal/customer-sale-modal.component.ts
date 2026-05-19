import { Dialog } from '@angular/cdk/dialog';
import { HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '@shared/components/button';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormDropdownComponent } from '@shared/form-dropdown/form-dropdown.component';
import { FormInputComponent } from '@shared/form-input/form-input.component';
import { Customer } from '@shared/interfaces/customer.interface';
import { CustomerService } from '@shared/services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

interface CustomerOption {
  id: string;
  name: string;
  nit: string;
  phone: string;
}

@Component({
  selector: 'app-customer-sale-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    FormInputComponent,
    FormDropdownComponent,
    ButtonComponent,
  ],
  templateUrl: './customer-sale-modal.component.html',
})
export class CustomerSaleModalComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _customerService = inject(CustomerService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _dialog = inject(Dialog);
  private readonly _toastr = inject(ToastrService);

  public readonly customerConfirmed = output<Customer>();
  protected readonly isCreatingCustomer = signal(false);
  protected readonly isSavingCustomer = signal(false);
  protected readonly customerOptions = signal<CustomerOption[]>([]);
  protected readonly filteredCustomerOptions = signal<CustomerOption[]>([]);

  protected readonly selectCustomerForm = this._fb.group({
    search: [''],
    customerId: ['', Validators.required],
  });

  protected readonly createCustomerForm = this._fb.group({
    name: ['', Validators.required],
    nit: ['', Validators.required],
    phone: ['', Validators.required],
  });

  public ngOnInit(): void {
    this._loadCustomers();
    this._watchSearch();
  }

  protected confirmCustomer(): void {
    const customerId = String(this.selectCustomerForm.value.customerId ?? '').trim();
    if (!customerId) {
      this.selectCustomerForm.get('customerId')?.markAsTouched();
      return;
    }

    const selected = this.customerOptions().find(option => option.id === customerId);
    if (!selected) {
      this._toastr.error('Selecciona un cliente valido.', 'Cliente requerido');
      return;
    }

    this.customerConfirmed.emit({
      id: customerId,
      name: selected.name,
      nit: selected.nit,
      phone: selected.phone,
      createdAt: '',
      updatedAt: '',
    });
  }

  protected toggleCreateCustomer(): void {
    this.isCreatingCustomer.update(current => !current);
  }

  protected createCustomer(): void {
    if (!this.createCustomerForm.valid || this.isSavingCustomer()) {
      this.createCustomerForm.markAllAsTouched();
      return;
    }

    const value = this.createCustomerForm.getRawValue();
    const payload = {
      name: String(value.name ?? '').trim(),
      nit: String(value.nit ?? '').trim(),
      phone: String(value.phone ?? '').trim(),
    };
    this.isSavingCustomer.set(true);

    this._customerService.create(payload).subscribe({
      next: customer => {
        const option = this._mapCustomerOption(customer);
        this.customerOptions.update(current => [option, ...current]);
        this.filteredCustomerOptions.set(
          this._filterCustomers(this.selectCustomerForm.value.search ?? '')
        );
        this.selectCustomerForm.patchValue({ customerId: String(customer.id) });
        this.createCustomerForm.reset({ name: '', nit: '', phone: '' });
        this.isCreatingCustomer.set(false);
        this.isSavingCustomer.set(false);
        this._toastr.success('Cliente registrado correctamente.', 'Exito');
      },
      error: error => {
        this.isSavingCustomer.set(false);
        this._toastr.error(error?.message || 'No se pudo registrar el cliente.', 'Error');
      },
    });
  }

  protected closeModal(): void {
    this._dialog.closeAll();
  }

  private _loadCustomers(): void {
    const params = new HttpParams().set('page', 1).set('pageSize', 300);
    this._customerService
      .getAll(params)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(response => {
        const options = (response.items ?? []).map(customer => this._mapCustomerOption(customer));
        this.customerOptions.set(options);
        this.filteredCustomerOptions.set(options);
      });
  }

  private _watchSearch(): void {
    this.selectCustomerForm
      .get('search')
      ?.valueChanges.pipe(
        map(value => String(value ?? '')),
        debounceTime(250),
        distinctUntilChanged(),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe(value => {
        this.filteredCustomerOptions.set(this._filterCustomers(value));
      });
  }

  private _filterCustomers(search: string): CustomerOption[] {
    const term = search.trim().toLowerCase();
    if (!term) {
      return this.customerOptions();
    }

    return this.customerOptions().filter(
      customer =>
        customer.name.toLowerCase().includes(term) ||
        customer.nit.toLowerCase().includes(term) ||
        customer.phone.toLowerCase().includes(term)
    );
  }

  private _mapCustomerOption(customer: Customer): CustomerOption {
    return {
      id: String(customer.id),
      name: String(customer.name ?? ''),
      nit: String(customer.nit ?? ''),
      phone: String(customer.phone ?? ''),
    };
  }
}
