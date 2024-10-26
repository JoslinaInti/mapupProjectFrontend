import { Injectable } from '@angular/core';
import * as Papa from 'papaparse';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {}

  // Step 1: Fetch the CSV file as text
  getCsvData(): Observable<any[]> {
    return this.http.get('assets/Electric_Vehicle_Population_Data.csv', { responseType: 'text' }).pipe(
      // Step 2: Pass the data to parseCsv for parsing
      switchMap(data => this.parseCsv(data))
    );
  }

  // Step 3: Parse the CSV data asynchronously
  parseCsv(data: string): Observable<any[]> {
    return new Observable(observer => {
      Papa.parse(data, {
        header: true,
        complete: (result: any) => {
          observer.next(result.data); // Emit parsed data
          observer.complete(); // Complete the observable
        },
        error: (error:any) => {
          observer.error(error); // Emit an error if parsing fails
        }
      });
    });
  }
}
