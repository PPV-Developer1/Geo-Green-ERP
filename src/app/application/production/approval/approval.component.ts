import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector   : 'az-approval',
  templateUrl: './approval.component.html',
  styleUrls  : ['./approval.component.scss']
})
export class ApprovalComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("approval",{static:true}) approval:ElementRef;

  selected        = [];
  product_details = [];
  filter_data     = [];

  detail_view    : any;
  openModel      : any;

  public uid     = localStorage.getItem('uid');
  loading        : boolean =false;

  constructor(private modalService: NgbModal,public api: ApiService, public toastrService: ToastrService)
  {

  }

  ngOnInit()
  {
    this.getProductList();
  }

  async getProductList()
  {
    await this.api.get('mp_production_view.php?authToken='+environment.authToken).then((data: any) =>
    {
      function levelFilter(value) { return (value.level === 2); }
      let get_data          = data.filter(levelFilter)
      this.product_details  = get_data;
      this.filter_data      = [...get_data];
    }).catch(error => {this.toastrService.error('Something went wrong');});
  }

  openSm(content)
  {
    this.openModel = this.modalService.open(content, { size: 'md'});
  }

  async onActivate(event)
  {
    if(event.type === "click")
    {
      this.openSm(this.approval);
      this.detail_view = event.row;
    }
  }

  async confirm()
  {
    let data = 0;
    this.loading= true;
    await this.api.post('single_field_update.php?table=production_material&field=id&value='+this.detail_view.id+'&up_field=level&update=3&authToken='+environment.authToken,data).then((data: any) =>
      {
        if(data.status == "success")
          {
            this.api.post('single_field_update.php?table=production_material&field=id&value='+this.detail_view.id+'&up_field=approved_by&update='+this.uid+'&authToken='+environment.authToken,data).then((data: any) =>
            {
              if(data.status == "success")
              {
                this.loading = false;
                this.getProductList();
                this.getProductList();
                this.openModel.dismiss();
                this.toastrService.success('Product Approved Succesfully');
                this.selected = [];
              }
              else { this.toastrService.error('Something went wrong : confirm');
              this.loading = false; }
            }).catch(error =>
            {
            this.toastrService.error('API Faild : confirm');
            this.loading = false;
            });
          }
          else { this.toastrService.error('Something went wrong : confirm Stage ');
          this.loading = false; }
        return true;
      }).catch(error =>
      {
          this.toastrService.error('API Faild : confirm');
          this.loading = false;
      });
  }

  updateFilter(event)
  {
   
    const val = event.target.value.toLowerCase();
      const temp = this.filter_data.filter((d) => {
        return Object.values(d).some(field =>
          field != null && field.toString().toLowerCase().indexOf(val) !== -1
        );
      });
      this.product_details = temp;
      this.table.offset = 0;
  }
}
