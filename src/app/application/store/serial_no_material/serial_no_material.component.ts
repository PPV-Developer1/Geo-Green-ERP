import { debounceTime } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from './../../../service/api.service';
import { Component, OnInit, Type } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-serial_no_material',
  templateUrl: './serial_no_material.component.html',
  styleUrls: ['./serial_no_material.component.scss']
})
export class Serial_no_materialComponent implements OnInit {

  SerialNo    : any
  ProductData : any
  detail_view : any

  constructor(
    public toastrService :ToastrService , public api:ApiService
  ) { }

  ngOnInit() {
  }

 async searh()
  {
    this.detail_view = null
    this.ProductData = null
    await  this.api.get('serial_no_material.php?serial_no='+this.SerialNo+'&authToken='+environment.authToken).then((data: any) =>
          {
            this.ProductData = data;
            console.log(data)
            if(data == null)
            {this.toastrService.warning('No data found');}
          }).catch(error => {this.toastrService.error('Something went wrong');});
  }

  onActivate(event)
  {
    if(event.type == "click")
    {
      console.log(event.row)
      this.detail_view  = event.row
    }
  }
}
