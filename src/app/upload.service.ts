import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SouthAfricanMobileNumbers } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private httpClient: HttpClient) { }

  upload(list) : Observable<SouthAfricanMobileNumbers[]>{
    return this.httpClient.post<SouthAfricanMobileNumbers[]>(
      "http://localhost:5071/api/southAfricanMobileNumbersController/uploadFile",
      list//jsonObject
    );
  }
}
