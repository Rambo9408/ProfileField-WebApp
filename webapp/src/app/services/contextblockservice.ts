import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Contextblockinterface } from '../interfaces/contextblockinterface';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Contextblockservice {
  private getUrl = "http://localhost:3000/api/getContextBlock";
  private addUrl = "http://localhost:3000/api/addContextBlock";
  // private updateUrl = "http://localhost:3000/api/updateField";
  // private updateOrderUrl = "http://localhost:3000/api/updateFieldOrder";
  private deleteUrl = "http://localhost:3000/api/deleteContextBlock";

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

  getContextBlock(panelId: string, subPanelId?: string): Observable<{ data: Contextblockinterface[] }> {
    let url = `${this.getUrl}?panelId=${panelId}`;
    if (subPanelId) {
      url += `&subPanelId=${subPanelId}`;
    }

    return this.http.get<{ data: Contextblockinterface[] }>(url).pipe(
      catchError(this.handleError)
    );
  }


  addContextBlock(Field: FormData): Observable<Contextblockinterface> {
    return this.http.post<Contextblockinterface>(this.addUrl, Field)
      .pipe(catchError(this.handleError));
  }

  deleteContextBlock(_id: string): Observable<Contextblockinterface> {
    return this.http.delete<Contextblockinterface>(`${this.deleteUrl}/${_id}`)
      .pipe(catchError(this.handleError));
  }
}
