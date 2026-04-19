import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PdfReportSummaryItem {
  label: string;
  value: string;
}

export interface PdfReportColumn<T> {
  header: string;
  value: (row: T) => string;
  width?: number;
  align?: 'left' | 'center' | 'right';
}

export interface PdfTableReportConfig<T> {
  title: string;
  rows: T[];
  columns: PdfReportColumn<T>[];
  filePrefix: string;
  fileContext?: string;
  generatedAt?: Date;
  summaries?: PdfReportSummaryItem[];
  footerRow?: string[];
  orientation?: 'portrait' | 'landscape';
  themeColor?: [number, number, number];
  locale?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PdfReportService {
  public exportTableReport<T>(config: PdfTableReportConfig<T>): void {
    if (!config.rows.length || !config.columns.length) {
      return;
    }

    const now = config.generatedAt ?? new Date();
    const locale = config.locale ?? 'es-MX';
    const color = config.themeColor ?? [40, 139, 131];
    const orientation = config.orientation ?? 'landscape';

    const doc = new jsPDF({ orientation });
    const generatedAtLabel = this._formatDateTime(now, locale);
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(0.8);
    doc.line(14, 11, pageWidth - 14, 11);

    doc.setFontSize(16);
    doc.text(config.title, 14, 16);
    doc.setFontSize(10);
    doc.text(`Generado: ${generatedAtLabel}`, 14, 23);
    doc.text(`Registros: ${config.rows.length}`, 14, 29);

    let summaryX = 70;
    for (const summary of config.summaries ?? []) {
      doc.text(`${summary.label}: ${summary.value}`, summaryX, 29);
      summaryX += 62;
    }

    const head = [config.columns.map(column => column.header)];
    const body = config.rows.map(row => config.columns.map(column => column.value(row)));

    const columnStyles: Record<
      number,
      { cellWidth?: number; halign?: 'left' | 'center' | 'right' }
    > = {};

    config.columns.forEach((column, index) => {
      columnStyles[index] = {
        cellWidth: column.width,
        halign: column.align,
      };
    });

    autoTable(doc, {
      startY: 34,
      head,
      body,
      foot: config.footerRow ? [config.footerRow] : undefined,
      theme: 'striped',
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: color },
      footStyles: { fillColor: color, textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [246, 250, 249] },
      columnStyles,
      didDrawPage: () => {
        const pageCount = doc.getNumberOfPages();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setFontSize(8);
        doc.setTextColor(120);
        doc.text(`Pagina ${pageCount}`, pageWidth - 28, pageHeight - 8);
      },
    });

    const fileDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')}`;
    const fileContext = config.fileContext
      ? `-${this._normalizeFileToken(config.fileContext)}`
      : '';

    doc.save(`${config.filePrefix}${fileContext}-${fileDate}.pdf`);
  }

  public formatCurrency(value: number, currency = 'BOB', locale = 'es-BO'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value ?? 0);
  }

  public formatDateTime(value: string | Date, locale = 'es-MX'): string {
    return this._formatDateTime(value, locale);
  }

  private _formatDateTime(value: string | Date, locale: string): string {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  private _normalizeFileToken(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}
