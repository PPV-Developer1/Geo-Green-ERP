import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-debit_note',
  templateUrl: './debit_note.component.html',
  styleUrls: ['./debit_note.component.scss']
})
export class Debit_noteComponent implements OnInit {

 temp : any;
  List : any;
  selected=[]
  show:boolean=false
    @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(public toastrService: ToastrService, private api: ApiService) { }

  ngOnInit() {
    this.TableData()
  }

 async TableData()
  {
     await this.api.get('credit_note_debit_note_list.php?type=debit&authToken='+environment.authToken).then((data: any) =>
        {
           console.log(data)
           this.List=data
            this.temp=[...data];
        }).catch(error => {this.toastrService.error('Something went wrong');});

  }

  updateFilter(event)
  {
        const val = event.target.value.toLowerCase();
              const temp = this.temp.filter((d) => {
                return Object.values(d).some(field =>
                  field != null && field.toString().toLowerCase().indexOf(val) !== -1
                );
              });
              this.List = temp;
          this.table.offset = 0;
  }

  onActivate(event)
  {
      if(event.type =="click")
      {
        console.log(event.row)
        localStorage.setItem("debit_note_id",event.row.id)
        this.show = true
      }
  }

  back()
  {
    this.show=false
  }
}
