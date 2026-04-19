import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Component,
  DestroyRef,
  HostListener,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { startWith } from 'rxjs';
import { FormErrorComponent } from '../components/form-error';

type DropdownOption = unknown;

@Component({
  selector: 'app-form-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CdkOverlayOrigin,
    CdkConnectedOverlay,
    FormErrorComponent,
  ],
  templateUrl: './form-dropdown.component.html',
})
export class FormDropdownComponent implements OnInit {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _selectedValue = signal<unknown>(null);

  public parentForm = input.required<FormGroup>();
  public controlName = input.required<string>();
  public label = input.required<string>();
  public name = input.required<string>();
  public placeholder = input<string>('Selecciona una opción');
  public options = input<DropdownOption[]>([]);
  public optionValueKey = input.required<string>();
  public optionLabelKey = input<string>('');
  public visibleKeys = input<string[]>([]);
  public emptyMessage = input<string>('Sin opciones disponibles');

  public optionSelected = output<unknown>();

  protected readonly isOpen = signal(false);

  protected readonly control = computed(() => {
    const form = this.parentForm();
    const controlName = this.controlName();
    return form?.get(controlName) as FormControl;
  });

  protected readonly hasError = computed(() => {
    const ctrl = this.control();
    return ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  });

  protected readonly isDisabled = computed(() => this.control()?.disabled ?? false);

  protected readonly selectedOption = computed<DropdownOption | null>(() => {
    const controlValue = this._selectedValue();
    if (controlValue === null || controlValue === undefined || controlValue === '') {
      return null;
    }

    const valueKey = this.optionValueKey();
    return (
      this.options().find(option =>
        this._isSameValue(this._getOptionField(option, valueKey), controlValue)
      ) ?? null
    );
  });

  protected readonly selectedLabel = computed(() => {
    const option = this.selectedOption();
    if (!option) {
      return this.placeholder();
    }

    return this.getOptionDisplay(option);
  });

  protected toggleDropdown(): void {
    if (this.isDisabled()) {
      return;
    }

    this.isOpen.update(current => !current);
  }

  protected closeDropdown(): void {
    this.isOpen.set(false);
  }

  public ngOnInit(): void {
    this._bindControlValue();
  }

  protected selectOption(option: DropdownOption): void {
    const ctrl = this.control();
    if (!ctrl) {
      return;
    }

    const valueKey = this.optionValueKey();
    const selectedValue = this._getOptionField(option, valueKey);
    ctrl.setValue(selectedValue);
    this._selectedValue.set(selectedValue);
    ctrl.markAsTouched();
    ctrl.markAsDirty();
    this.optionSelected.emit(option);
    this.closeDropdown();
  }

  protected isOptionSelected(option: DropdownOption): boolean {
    const selected = this.selectedOption();
    if (!selected) {
      return false;
    }

    const valueKey = this.optionValueKey();
    return this._isSameValue(
      this._getOptionField(option, valueKey),
      this._getOptionField(selected, valueKey)
    );
  }

  protected getOptionDisplay(option: DropdownOption): string {
    const keysToShow = this.visibleKeys();
    if (keysToShow.length > 0) {
      const values = keysToShow
        .map(key => this._asString(this._getOptionField(option, key)))
        .filter(value => value.length > 0);

      if (values.length > 0) {
        return values.join(' · ');
      }
    }

    const labelKey = this.optionLabelKey();
    if (labelKey) {
      return this._asString(this._getOptionField(option, labelKey));
    }

    return this._asString(this._getOptionField(option, this.optionValueKey()));
  }

  protected trackByOption = (_index: number, option: DropdownOption): string => {
    return this._asString(this._getOptionField(option, this.optionValueKey()));
  };

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closeDropdown();
  }

  private _bindControlValue(): void {
    const ctrl = this.control();
    if (!ctrl) {
      return;
    }

    ctrl.valueChanges
      .pipe(startWith(ctrl.value), takeUntilDestroyed(this._destroyRef))
      .subscribe(value => {
        this._selectedValue.set(value);
      });
  }

  private _isSameValue(left: unknown, right: unknown): boolean {
    return this._asString(left) === this._asString(right);
  }

  private _asString(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }

    return String(value);
  }

  private _getOptionField(option: unknown, key: string): unknown {
    if (!option || typeof option !== 'object') {
      return undefined;
    }

    return (option as Record<string, unknown>)[key];
  }
}
