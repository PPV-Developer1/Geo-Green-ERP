export class DcItem {
    dc_no : string;
    items: Item[] = [];
    constructor() 
    {
        this.items.push(new Item());       
    }
}


export class Item {
    sno : string;
    item_description: string;
    hsn: string;
    uom: string;
    qty: string;
    unitRate: string;
    tax_amount : string;
    itemCgstPercent : string;
    itemCgstAmount : string;
    itemSgstPercent : string;
    itemSgstAmount : string;
    itemAmount : string;

}