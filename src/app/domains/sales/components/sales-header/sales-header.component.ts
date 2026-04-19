import { Component, computed, inject } from '@angular/core';
import { Branch } from '@shared/interfaces/branch.interface';
import { AuthService } from '@shared/services/auth.service';
import { PdfReportService } from '@shared/services/pdf-report.service';
import { getSelectedBranchFromStorage } from '@shared/utils/selected-branch-storage';
import { SalesResourceService } from '../../services/sales-resource.service';

@Component({
  selector: 'app-sales-header',
  templateUrl: './sales-header.component.html',
})
export class SalesHeaderComponent {
  private readonly _authService = inject(AuthService);
  private readonly _salesResourceService = inject(SalesResourceService);
  private readonly _pdfReportService = inject(PdfReportService);

  protected readonly currentBranch = computed(() => {
    const fromState = this._authService.selectedBranch()?.name;
    if (fromState) {
      return fromState;
    }

    const fromStorage = getSelectedBranchFromStorage<Branch>()?.name;
    return fromStorage ?? 'Sin sucursal';
  });

  protected generateReport(): void {
    const data = this._salesResourceService.salesData()?.items ?? [];
    if (!data.length) {
      console.warn('No hay ventas para generar el reporte.');
      return;
    }

    const branchName = this.currentBranch();
    const totalAmount = data.reduce((acc, sale) => acc + sale.total, 0);
    const totalItems = data.reduce((acc, sale) => acc + sale.items, 0);

    this._pdfReportService.exportTableReport({
      title: `Reporte de ventas - ${branchName}`,
      rows: data,
      filePrefix: 'reporte-ventas',
      fileContext: branchName,
      summaries: [
        { label: 'Total articulos', value: String(totalItems) },
        {
          label: 'Total ventas',
          value: this._pdfReportService.formatCurrency(totalAmount, 'BOB', 'es-BO'),
        },
      ],
      footerRow: [
        '',
        '',
        '',
        'TOTALES',
        String(totalItems),
        this._pdfReportService.formatCurrency(totalAmount, 'BOB', 'es-BO'),
      ],
      columns: [
        {
          header: 'Fecha',
          value: sale => this._pdfReportService.formatDateTime(sale.date),
          width: 35,
        },
        { header: 'Vendedor', value: sale => sale.sellerName, width: 38 },
        { header: 'Sucursal', value: sale => sale.branchName, width: 45 },
        { header: 'Productos', value: sale => sale.productsSummary, width: 90 },
        { header: 'Articulos', value: sale => String(sale.items), width: 20, align: 'right' },
        {
          header: 'Total',
          value: sale => this._pdfReportService.formatCurrency(sale.total, 'BOB', 'es-BO'),
          width: 25,
          align: 'right',
        },
      ],
    });
  }
}
