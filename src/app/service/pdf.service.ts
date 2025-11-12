// src/app/services/pdf-generator.service.ts
import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {
  constructor() {}

  /**
   * Directly generate a dynamic PDF
   * @param title - Document title
   * @param companyHeader - Company name
   * @param companyAddress - Address text
   * @param data - Array of objects (your ledger data)
   * @param numericFields - Array of field names that should be treated as numbers
   * @param action - 'open' | 'download'
   * @param clientName
   * @param clientAddress
   */
  generateDynamicPdf(
    title: string,
    companyHeader: string,
    companyAddress: string,
    clientName : string,
    clientAddress : string,
    data: any[],
    numericFields: string[] = [],
    action: 'open' | 'download' = 'open'
  ) {
    if (!data || data.length === 0) {
      alert('No data to generate PDF.');
      return;
    }

    const columns = Object.keys(data[0]);

    // Create header row dynamically
    const tableBody: any[] = [];
    tableBody.push(
      columns.map(col => ({
        text: this.toTitle(col),
        style: 'tableHeader',
        alignment: numericFields.includes(col) ? 'right' : 'left'
      }))
    );


    // Add data rows
    data.forEach(row => {
      const rowData = columns.map(col => ({
        text: numericFields.includes(col)
          ? this.formatNumber(row[col])
          : (row[col] ?? '').toString(),
        alignment: numericFields.includes(col) ? 'right' : 'left',
        style: 'tableCell'
      }));
      tableBody.push(rowData);
    });

    // Add totals row for numeric columns
    if (numericFields.length > 0) {
      const totalRow: any[] = [];
      columns.forEach(col => {
        if (numericFields.includes(col)) {
          const total = data.reduce((sum, item) => sum + (Number(item[col]) || 0), 0);
          totalRow.push({
            text: this.formatNumber(total),
            style: 'totalCell',
            alignment: 'right'
          });
        } else if (col === columns[0]) {
          totalRow.push({
            text: 'Total',
            style: 'totalCell',
            alignment: 'left'
          });
        } else {
          totalRow.push({ text: '', style: 'totalCell' });
        }
      });
      tableBody.push(totalRow);
    }

    const docDefinition: any = {
              pageSize: 'A4',
              pageMargins: [40, 100, 40, 60],

              header: (currentPage: number, pageCount: number) => ({
                margin: [40, 20, 40, 0],
                columns: [
                  {
                    width: '*',
                    stack: [
                      { text: companyHeader, style: 'companyTitle' },
                      { text: companyAddress, style: 'companyAddress' }
                    ]
                  },
                  {
                    width: 300,
                    stack: [
                      { text: title, style: 'statementTitle', alignment: 'right' },
                      { text: `Page ${currentPage} of ${pageCount}`, style: 'pageInfo', alignment: 'right' }
                    ]
                  }
                ]
              }),

          /** 👇 Add a company + client info section before the table **/
          content: [
            // {
          //     columns: [
          //       {
          //         width: '*',
          //         stack: [
          //           { text: clientName, style: 'companyTitleBig' },
          //           { text: clientAddress, style: 'companyAddress' },
          //         ]
          //       },
          //       {
          //         width: 200,
          //         stack: [
          //           { text: 'Client Name:', style: 'clientLabel' },
          //           { text: clientName, style: 'clientValue' },
          //           clientAddress ? { text: clientAddress, style: 'clientAddress' } : {},
          //         ]
          //       }
          //     ],
          //     margin: [0, 0, 0, 10] // spacing below
            // },

    /** 🧾 Ledger Table **/
    {
      table: {
        headerRows: 1,
        widths: columns.map(() => '*'),
        body: tableBody
      },
      layout: {
        fillColor: (rowIndex: number) => (rowIndex === 0 ? '#eeeeee' : null)
      }
    }
  ],

  styles: {
    companyTitleBig: { fontSize: 16, bold: true, margin: [0, 0, 0, 2], color: '#2E3B8F' },
    companyAddress: { fontSize: 9, margin: [0, 0, 0, 6] },
    clientLabel: { fontSize: 10, bold: true, margin: [0, 0, 0, 2] },
    clientValue: { fontSize: 10, bold: true, margin: [0, 0, 0, 2], color: '#333' },
    clientAddress: { fontSize: 9, color: '#555' },
    statementTitle: { fontSize: 8, bold: true },
    pageInfo: { fontSize: 8 },
    tableHeader: { bold: true, fontSize: 10, margin: [0, 5, 0, 5] },
    tableCell: { fontSize: 9, margin: [0, 3, 0, 3] },
    totalCell: { bold: true, fontSize: 10, margin: [0, 6, 0, 6] },
  }
};



    // Direct action
    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download(`${title}.pdf`);
    } else {
      pdfMake.createPdf(docDefinition).open();
    }
  }

  private toTitle(str: string): string {
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
  }

  private formatNumber(n: any) {
    if (n == null || n === '') return '';
    return Number(n).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}
