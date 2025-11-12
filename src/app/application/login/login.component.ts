import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import { ApiService } from "../../service/api.service";
import { ToastrService, GlobalConfig } from 'ngx-toastr';

@Component({
  selector: 'az-login',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    public router: Router;
    public form:FormGroup;
    public email:AbstractControl;
    public password:AbstractControl;

    constructor(router:Router, fb:FormBuilder, public api: ApiService,public toastrService: ToastrService) {
        this.router = router;
        this.form = fb.group({
            'email': ['', Validators.compose([Validators.required, emailValidator])],
            'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
        });

        this.email = this.form.controls['email'];
        this.password = this.form.controls['password'];
    }

    public onSubmit(values): void {
        if (this.form.valid)
        {
            this.api.get('login.php?email='+values.email+'&password='+values.password).then((data: any) =>
            {
              console.log(data)
                if (data.message == "success")
                {
                  const details = data.data
                    if (details[0].status === 1)
                    {
                        localStorage.setItem('uid', details[0].emp_id);
                        localStorage.setItem('type_id', details[0].user_type);
                        localStorage.setItem('type', details[0].type);
                        localStorage.setItem('prefix', details[0].emp_prefix);
                        localStorage.setItem('name', details[0].name);
                        localStorage.setItem('last_login', details[0].last_login);
                        localStorage.setItem('designation', details[0].designation);
                        localStorage.setItem('image', details[0].image);
                        localStorage.setItem('bank_id', details[0].bank_id);

                        localStorage.setItem('com_name', details[0].com_name);
                        localStorage.setItem('com_logo', details[0].com_logo);
                        localStorage.setItem('com_icon', details[0].com_icon);

                        this.router.navigate(['/app']);
                        this.toastrService.success('Welcome Back Mr.'+details[0].name);
                    }
                    else
                    {
                        if (data[0].message)
                        {
                            this.toastrService.error(data[0].message);
                        }
                        else
                        {
                            this.toastrService.error('Something went wrong');
                        }
                    }
                }
                else if(data.message == "invalid password")
                {
                    this.toastrService.error('Incorrect Password');
                }
              else if(data.message == "invalid user")
                {
                    this.toastrService.error('Invalid User');
                }
                return true;
            }).catch(error =>
            {
                this.toastrService.error('Incorrect Username / Password');
            });
        }
    }
}

export function emailValidator(control: FormControl): {[key: string]: any} {
    var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
    if (control.value && !emailRegexp.test(control.value)) {
        return {invalidEmail: true};
    }
}
