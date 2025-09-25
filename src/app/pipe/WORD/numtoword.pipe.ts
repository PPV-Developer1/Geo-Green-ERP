import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numtoword',
  
})
export class NumtowordPipe implements PipeTransform {
  transform(value: any): string {
    let val = Number(value);
    if (!isNaN(val)) {
      return this.convertNumberToWords(val);
    }
    return value;
  }

  private convertNumberToWords(amount: number): string {
    const ones = [
      '', 'One', 'Two', 'Three', 'Four', 'Five',
      'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen',
      'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
    ];

    const tens = [
      '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty',
      'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];

    const numberToWords = (n: number): string => {
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numberToWords(n % 100) : '');
      if (n < 100000) return numberToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numberToWords(n % 1000) : '');
      if (n < 10000000) return numberToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numberToWords(n % 100000) : '');
      return numberToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numberToWords(n % 10000000) : '');
    };

    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);  // Convert decimal to paise

    let result = '';

    if (rupees > 0) {
      result += 'Rupees ' + numberToWords(rupees);
    }

    if (paise > 0) {
      result += (rupees > 0 ? ' and ' : '') + numberToWords(paise) + ' Paise';
    }

    if (!result) {
      result = 'Zero';
    }

    return result + ' Only';
  }
}
