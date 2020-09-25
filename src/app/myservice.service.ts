import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/observable/throw';
import { catchError } from 'rxjs/operators';
// import { ErrorObservable } from 'rxjs/observable/ErrorObservable';


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
    return this.httpClient.post(
      post_link, 
      JSON.stringify(op_num),
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).pipe(catchError(this.errorHandler));

  }

  errorHandler(error: HttpErrorResponse){
    document.getElementById("progressBar").style.display="none";
    if (error.error instanceof ErrorEvent){
      console.error('Client Side Error 1:', error.error.message);
      return throwError(error.error.message);
    }else{
      console.error('Client Side Error:', error);
      return throwError(error);
    }
    
    
    
  }
  
  
}
