import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class MyserviceService {

  constructor(private httpClient: HttpClient) { }

  doThisNow(): Observable<any> {
    
    let post_link = window.location.href.concat('printMyStuff');
    console.log("This is the address :", post_link)
    var op_num = {'name': 'Kashish', 'probability1': '0.0', 'probability2':'0.1', 'state': '0.2'};
    console.log("This is op_num :", op_num)
    return this.httpClient.post(
      post_link, 
      JSON.stringify(op_num),
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })




  }
  
}
