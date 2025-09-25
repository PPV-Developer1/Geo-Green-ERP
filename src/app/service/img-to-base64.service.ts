import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Http, Response } from "@angular/http";
import { Observable } from 'rxjs';
// import { ViewDevice } from "./view-device";
@Injectable({
  providedIn: 'root'
})
export class ImgToBase64Service {


  
  constructor(private http: HttpClient) { }
  
  imgToString(imageUrl: string ): Observable<Blob> {
    return this.http.get(imageUrl, { responseType: 'blob' });
  }
  

}
