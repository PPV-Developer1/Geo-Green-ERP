import { Injectable, NgModule } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService
{
  [x: string]: any;

  baseUrl: any = '';
  translations: any[] = [];

  constructor( private http: HttpClient)
   {
    this.baseUrl = environment.baseURL;
    }

  public post(url: string, body: any): Promise<any>
  {
    console.log("Post Request Received");
    return new Promise<any>((resolve, reject) =>
    {
     console.log('Post Request : ',this.baseUrl + url, body);
      this.http.post(this.baseUrl + url, body).subscribe((data) =>
      {
        console.log(data)
        resolve(data);
      }, error => {
        resolve(error);
      });
    });
  }

  public get(url: string): Promise<any>
  {
    console.log("Get Request Received");
    return new Promise<any>((resolve, reject) =>
    {
      console.log('get Request : ',this.baseUrl + url);
      this.http.get(this.baseUrl + url).subscribe((data) =>
      {
       console.log(data)
        resolve(data);
      },
      error =>
      {
        resolve(error);
      });
    });
  }

}
