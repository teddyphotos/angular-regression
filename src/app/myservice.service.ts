import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class MyserviceService {

  constructor(private httpClient: HttpClient) { }

  doThisNow(trainingSet): Observable<any> {
    let trainingX = trainingSet[0]
    let trainingY = trainingSet[1]
    var op_num = {'trainingX': trainingX, 'trainingY': trainingY};

    
    let post_link = window.location.href.concat('runRegression');
    console.log("This is the address :", post_link)
    
    // console.log("This is op_num :", op_num)
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
