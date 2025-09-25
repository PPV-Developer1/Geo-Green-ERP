import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-acceptence',
  templateUrl: './acceptence.component.html',
  styleUrls: ['./acceptence.component.scss']
})
export class AcceptenceComponent implements OnInit {

  public acceptence_list :any;
  public vendor_list     :any;
  public bill_list       :any;
  public bill_id         :any;
  public open_popup      :any;
  temp                   :any;

  loading:boolean  = false;
  show   :boolean  = false;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("Add_list", { static: true }) Add_list : ElementRef;

  constructor(public  fb           : FormBuilder,
    public  toastrService: ToastrService,
    private api          : ApiService,
    private modalService : NgbModal) { }

  ngOnInit() {
    this.LoadDetails()

  }

  async LoadDetails()
  {
    await this.api.get('get_data.php?table=vendor&authToken=' + environment.authToken).then((data: any)  =>
    {
      {
        this.vendor_list = data;
      }
    }).catch(error => { this.toastrService.error('Something went wrong in LoadVendorDetails'); });

    await this.api.get('get_data.php?table=bill&find=acceptence&value=0&asign_field=bill_id&asign_value=DESC&authToken=' + environment.authToken).then((data: any) =>
    {
      if(data != null)
      {
        this.acceptence_list = data;
        for(let i=0;i<data.length;i++)
        {
          let id =  data[i]['vendor_id'];
          var value = this.vendor_list.find(t=>t.vendor_id == id);
          this.acceptence_list[i]['name'] = value.company_name
          this.temp =[...this.acceptence_list];
        }
      }
      else{
        this.acceptence_list = data;
      }
    }).catch(error => { this.toastrService.error('Something went wrong in LoadVendorDetails'); });
  }

  updateFilter(event)
  {

    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d) => {
      return Object.values(d).some(field =>
        field != null && field.toString().toLowerCase().indexOf(val) !== -1
      );
    });
    this.acceptence_list = temp;
    this.table.offset = 0;
  }

  onActivate(event)
  {
    if(event.type =='click')
    {
      this.show=true;
      this.bill_id = event.row.bill_id;

     this.api.get('mp_bill_acceptence_list.php?value='+event.row.bill_id+'&authToken=' + environment.authToken).then((data: any) =>
        {
          this.bill_list = data;
        }).catch(error => { this.toastrService.error('Something went wrong in LoadVendorDetails'); });
    }
  }

  onActivate_1()
  {

  }

  ReturnToList()
  {
    this.show = false;
  }

  popup()
  {
    this.open_popup =  this.modalService.open(this.Add_list, { size: 'md' });
  }

  AcceptToList()
  {
    let status = 1;
    this.loading = true;
   this.api.post('post_update_data.php?table=bill&field=bill_id&value=' + this.bill_id + '&authToken=' + environment.authToken,status).then((data_rt: any) =>
    {
      if(data_rt.status='success')
      {
        this.loading = false;
        this.toastrService.success('Updated Successful');
        this.open_popup.close();
        this.LoadDetails();
        this.show = false;

      }
    }).catch(error => { this.toastrService.error('Something went wrong in LoadVendorDetails');
       this.loading = false; });
  }
}
