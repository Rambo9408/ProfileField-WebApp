import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Fieldinterface } from '../interfaces/fieldinterface';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class Fieldservice {
  private fieldsSubject = new BehaviorSubject<any[]>([]);
  fields$ = this.fieldsSubject.asObservable();

  private getUrl = "http://localhost:3000/api/fields";
  private addUrl = "http://localhost:3000/api/addFields";
  private updateUrl = "http://localhost:3000/api/updateField";
  private updateOrderUrl = "http://localhost:3000/api/updateFieldOrder";
  private deleteUrl = "http://localhost:3000/api/deleteField";

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    let errorMsg = '';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMsg = `Client error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMsg = `Server error: ${error.status} - ${error.message || error.error.message}`;
    }

    console.error(errorMsg);
    return throwError(() => new Error(errorMsg));
  }

  getFields(): Observable<Fieldinterface[]> {
    return this.http.get<Fieldinterface[]>(this.getUrl).pipe(tap(() => this.refreshFields()),catchError(this.handleError));
  }

  getFieldById(_id: string): Observable<Fieldinterface> {
    return this.http.get<Fieldinterface>(`${this.getUrl}/${_id}`).pipe(tap(() => this.refreshFields()),catchError(this.handleError));
  }

  addField(Field: FormData): Observable<Fieldinterface> {
    return this.http.post<Fieldinterface>(this.addUrl, Field).pipe(tap(() => this.refreshFields()),catchError(this.handleError));
  }

  updateField(_id: string, data: Omit<Fieldinterface, 'id'>): Observable<Fieldinterface> {
    return this.http.put<Fieldinterface>(`${this.updateUrl}/${_id}`, data).pipe(tap(() => this.refreshFields()),catchError(this.handleError));
  }

  deleteField(_id: string): Observable<Fieldinterface> {
    return this.http.delete<Fieldinterface>(`${this.deleteUrl}/${_id}`).pipe(tap(() => this.refreshFields()),catchError(this.handleError));
  }

  updateFieldOrder(fields: Fieldinterface[]): Observable<Fieldinterface[]> {
    return this.http.put<Fieldinterface[]>(this.updateOrderUrl, fields).pipe(tap(() => this.refreshFields()),catchError(this.handleError));
  }

  public refreshFields() {
    this.http.get<Fieldinterface[]>(this.getUrl).subscribe((fields) => {
      this.fieldsSubject.next(fields);
    });
  }
}
