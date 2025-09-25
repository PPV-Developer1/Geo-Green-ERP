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
            this.api.get('login.php?email='+values.email).then((data: any) =>
            {

                if (data[0].password === values.password)
                { 
                    if (data[0].status === 1)
                    {
                        localStorage.setItem('uid', data[0].emp_id);
                        localStorage.setItem('type_id', data[0].user_type);
                        localStorage.setItem('type', data[0].type);
                        localStorage.setItem('prefix', data[0].emp_prefix);
                        localStorage.setItem('name', data[0].name);
                        localStorage.setItem('last_login', data[0].last_login);
                        localStorage.setItem('designation', data[0].designation);
                        localStorage.setItem('image', data[0].image);
                        localStorage.setItem('bank_id', data[0].bank_id);

                        localStorage.setItem('com_name', data[0].com_name);
                        localStorage.setItem('com_logo', data[0].com_logo);
                        localStorage.setItem('com_icon', data[0].com_icon);

                        this.router.navigate(['/app']);
                        this.toastrService.success('Welcome Back Mr.'+data[0].name);
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
                else
                {
                    this.toastrService.error('Incorrect Password');
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
