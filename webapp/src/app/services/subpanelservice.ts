import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subpanelinterface } from '../interfaces/subpanelinterface';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Subpanelservice {
  private getUrl = "http://localhost:3000/api/subPanel";
  private addUrl = "http://localhost:3000/api/addSubPanel";
  private updateUrl = "http://localhost:3000/api/updateSubPanel";
  // private updateOrderUrl = "http://localhost:3000/api/updateSubPanelOrder";
  private deleteUrl = "http://localhost:3000/api/deleteSubPanel";

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
  
  getSubPanels(): Observable<Subpanelinterface[]> {
    return this.http.get<Subpanelinterface[]>(this.getUrl).pipe(catchError(this.handleError));;
  }

  getSubPanelById(_id: string): Observable<{ data: Subpanelinterface }> {
    return this.http.get<{ data: Subpanelinterface }>(`${this.getUrl}/${_id}`).pipe(catchError(this.handleError));;
  }

  addSubPanel(Panel: FormData): Observable<Subpanelinterface> {
    return this.http.post<Subpanelinterface>(this.addUrl, Panel).pipe(catchError(this.handleError));;
  }

  updateSubPanel(_id: string, data: Omit<Subpanelinterface, 'id'>): Observable<Subpanelinterface> {
    return this.http.put<Subpanelinterface>(`${this.updateUrl}/${_id}`, data).pipe(catchError(this.handleError));;
  }

  deleteSubPanel(_id: string): Observable<Subpanelinterface> {
    return this.http.delete<Subpanelinterface>(`${this.deleteUrl}/${_id}`).pipe(catchError(this.handleError));;
  }

  // updateSubPanelOrder(panels: Subpanelinterface[]): Observable<Subpanelinterface[]> {
  //   return this.http.put<Subpanelinterface[]>(this.updateOrderUrl, panels);
  // }
}
