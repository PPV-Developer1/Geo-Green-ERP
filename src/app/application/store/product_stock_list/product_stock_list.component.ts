import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product_stock_list',
  templateUrl: './product_stock_list.component.html',
  styleUrls: ['./product_stock_list.component.scss']
})
export class Product_stock_listComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  stock_list:any;
 product_list:any
 list_show:boolean=false
  filter_data = []
  constructor( public toastrService :ToastrService , public api:ApiService) { }

  ngOnInit() {
        this.loadItem();
  }

  loadItem()
  {
   this.api.get('mp_production_stock.php?authToken='+environment.authToken).then((data: any) =>
    {
      this.stock_list = data;
      this.filter_data = [...data];
    }).catch(error => {this.toastrService.error('Something went wrong');});
  }
  onActivate(event)
  {
    if(event.type=='click')
    {
       this.product_list = event.row.product_list

       this.list_show= true
       console.log(event.row)
    }
  }

  set_zero()
  {
    this.list_show= false
  }

  updateFilter(event)
  {
    const val = event.target.value.toLowerCase();
    const temp = this.filter_data.filter((d) => {
      return Object.values(d).some(field =>
        field != null && field.toString().toLowerCase().indexOf(val) !== -1
      );
    });
    this.stock_list = temp;
    this.table.offset = 0;
  }
}
