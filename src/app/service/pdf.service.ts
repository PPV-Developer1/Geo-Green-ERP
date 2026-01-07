// src/app/services/pdf-generator.service.ts
import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

    // --- Placeholder Methods for toTitle and formatNumber ---
    // These methods MUST exist in your service for the PDF generation to work.
    private toTitle(str: string): string {
        // Example implementation: converts 'field_name' to 'Field Name'
        return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }

// The correct regex for Indian numbering format
// Safer two-step logic for Indian numbering system
private formatNumberINR(n: any): string {
    const value = Number(n).toFixed(2);
    const parts = value.split('.');

    // Format the integer part: 1234567 -> 12,34,567
    const integerPart = parts[0].replace(/\B(?=(\d{2})+(?!\d))/g, ',');

    // Combine parts
    return '₹' + integerPart + (parts[1] ? '.' + parts[1] : '');
}
    // --------------------------------------------------------


    /**
     * Generates a dynamic PDF ledger using pdfMake.
     * @param title - The title of the document.
     * @param companyHeader - The main title of the company (e.g., Geo Green Enviro Engineers).
     * @param companyAddress - The address of the company.
     * @param clientName - The name of the client/vendor.
     * @param clientAddress - The address of the client/vendor.
     * @param data - The array of transaction data.
     * @param numericFields - Array of keys that should be right-aligned and formatted as numbers.
     * @param action - 'open' or 'download' the PDF.
     */
    generateDynamicPdf(
        title: string,
        companyHeader: string,
        companyAddress: string,
        clientName: string,
        clientAddress: string,
        data: any[],
        numericFields: string[] = [],
        action: 'open' | 'download' = 'open',
    ) {
        if (!data || data.length === 0) {
            console.error('No data to generate PDF.');
            return;
        }

        const columns = Object.keys(data[0]);

        // Create header row dynamically
        const tableBody: any[] = [];
        tableBody.push(
            columns.map(col => ({
                // Using this.toTitle now that it is a class method
                text: this.toTitle(col),
                style: 'tableHeader',
                alignment: numericFields.includes(col) ? 'right' : 'left'
            }))
        );


        // Add data rows
        data.forEach(row => {
            const rowData = columns.map(col => ({

              text: numericFields.includes(col) ? row[col]: (row[col] ?? '').toString(),
                alignment: numericFields.includes(col) ? 'right' : 'left',
                style: 'tableCell'
            }));
            tableBody.push(rowData);
        });

        // A4 content width is 595.28 points - (2 * 30 margins) = 535.28
       const contentWidth = 842 - 60; // page width - margins
      const columnWidths = this.calculateColumnWidths(data, columns, contentWidth);

        const docDefinition: any = {
            //   pageSize: 'A4',
            //  pageMargins: [30, 40, 30, 40],

            pageSize: 'A4',
            pageOrientation: 'landscape',
            pageMargins: [30, 60, 30, 40],
            info: {
                  title:title,
                },

        header: (currentPage: number, pageCount: number) => ({
                  margin: [0, 10, 0, 5],
                  stack: [
                      // Company details stack...
                      {
                          width: '*',
                          stack: [
                              { text: companyHeader, style: 'companyTitleBig', alignment: 'center' },
                              { text: companyAddress, style: 'companyAddress', alignment: 'center', border: [] }
                          ]
                      }
                  ]
              }),

      /** 👇 Add a company + client info section before the table **/
      content: [
             // NEW: Horizontal line above the client portion
            {
             canvas: [
                      {
                        type: 'line',
                        x1: 0,
                        y1: 0,
                        x2: contentWidth, // Full content width for A4 (595.28 - 60)
                        y2: 0,
                        lineWidth: 1 }
                      ]
            },

            // Client Info Block
            {
            margin: [0,10,0,10],
            columns: [
                    {
                      width: '*',
                          stack: [
                                 { text: clientName, style: 'clientValue',alignment:'center' },
                                 { text: clientAddress, style: 'clientAddress' ,alignment:'center'},
                                ]
                    },
                ],
      },


    /** 🧾 Ledger Table **/
    {
      table: {
        headerRows: 1,
        widths: columns.map(() => '*'),
        body: tableBody
      },

      layout: {
      hLineWidth: (rowIndex, node) => {
      if (rowIndex === 0) return 1; // top of header
      if (rowIndex === 1) return 1; // bottom of header
      return 0;                     // no other horizontal borders
    },

    vLineWidth: () => 0,             // no vertical borders
    hLineColor: () => '#000',
    paddingLeft: () => 1,
    paddingRight: () => 1,
    paddingTop: () => 2,
    paddingBottom: () => 2
      }
    }
  ],

      styles: {
          companyTitleBig: { fontSize: 16, bold: true, margin: [0, 0, 0, 0], color: '#2E3B8F' },
          companyAddress: { fontSize: 9, margin: [0, 0, 0, 2] },
          clientLabel: { fontSize: 10, bold: true, margin: [0, 0, 0, 2] },
          clientValue: { fontSize: 10, bold: true, margin: [0, 0, 0, 2], color: '#333' },
          clientAddress: { fontSize: 9, color: '#555' },
          statementTitle: { fontSize: 8, bold: true },
          pageInfo: { fontSize: 8 },
          tableHeader: { bold: true, fontSize: 10, margin: [0, 5, 0, 5] },
          tableCell: { fontSize: 9, margin: [3, 3, 3, 3] },
          totalCell: { bold: true, fontSize: 10, margin: [0, 6, 0, 6] },
      },
            footer: function (currentPage, pageCount) {
                return {
                    columns: [
                        // Text is now aligned left with the page margin
                        { text: 'From Geo Green ERP', alignment: 'left', margin: [30, 0, 0, 25], fontSize: 8 },
                        // Page info is now aligned right with the page margin
                        { text: 'Page ' + currentPage + ' of ' + pageCount, alignment: 'right', margin: [0, 0, 30, 20], fontSize: 8 }
                    ]
                };
            },
        };

        // pdfMake.createPdf(docDefinition).open();
        const pdfDoc = pdfMake.createPdf(docDefinition);
        if (action === 'download') {
            pdfDoc.download(title.replace(/\s/g, '_') + '.pdf');
        } else {
            pdfDoc.open();
        }
    }

    calculateColumnWidths(data: any[], columns: string[], maxWidth: number): number[] {
    // rough character-to-pdf width estimate
    const charWidth = 6; // average width in pdfMake for fontSize: 9-10

    // 1. Measure max text length for each column
    const columnMaxChars = columns.map(col => {
        let maxChars = col.length; // header

        data.forEach(row => {
            const text = (row[col] ?? '').toString();
            if (text.length > maxChars) {
                maxChars = text.length;
            }
        });

        return maxChars;
    });

    // 2. Convert char count → width (in points)
    let widths = columnMaxChars.map(chars => chars * charWidth);

    // 3. If total width > maxWidth → scale proportionally
    const total = widths.reduce((a, b) => a + b, 0);

    if (total > maxWidth) {
        const scale = maxWidth / total;
        widths = widths.map(w => w * scale);
    }

    // 4. Apply minimum + maximum bounds
    widths = widths.map(w =>
        Math.max(50, Math.min(w, 200)) // min 50, max 200
    );

    return widths;
}
}
