import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product_stock_list',
  templateUrl: './product_stock_list.component.html',
  styleUrls: ['./product_stock_list.component.scss']
})
export class Product_stock_listComponent implements OnInit {

  stock_list:any;
 product_list:any
 list_show:boolean=false

  constructor( public toastrService :ToastrService , public api:ApiService) { }

  ngOnInit() {
        this.loadItem();
  }

  loadItem()
  {
   this.api.get('mp_production_stock.php?authToken='+environment.authToken).then((data: any) =>
    {
      this.stock_list = data;
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
}
