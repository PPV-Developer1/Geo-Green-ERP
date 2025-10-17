import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'indianCurrency'})
export class IndianCurrency implements PipeTransform {
  transform(value: number, args: string[]): any {

        if (! isNaN(value)) {
            var currencySymbol = '₹';

             if(value == 0)
               {
                return 0
               }
               const roundedValue = parseFloat(value.toString()).toFixed(2);
               const result = roundedValue.split(".");

            var lastThree = result[0].substring(result[0].length - 3);
            var otherNumbers = result[0].substring(0, result[0].length - 3);
            if (otherNumbers != '')
                lastThree = ',' + lastThree;
            var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

            if (result.length > 1) {
                output += "." + result[1];
            }

            return currencySymbol + output;
        }

  }
}
