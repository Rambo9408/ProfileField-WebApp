import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Panelinterface } from '../interfaces/panelinterface';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Panelservice {
  private refreshPanelsSubject = new BehaviorSubject<void>(undefined);
  refreshPanels$ = this.refreshPanelsSubject.asObservable();

  private getUrl = "http://localhost:3000/api/panel";
  private addUrl = "http://localhost:3000/api/addPanel";
  private updateUrl = "http://localhost:3000/api/updatePanel";
  private updateOrderUrl = "http://localhost:3000/api/updatePanelOrder";
  private deleteUrl = "http://localhost:3000/api/deletePanel";

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

  getPanels(): Observable<Panelinterface[]> {
    return this.http.get<Panelinterface[]>(this.getUrl).pipe(catchError(this.handleError));;
  }

  getPanelById(_id: string): Observable<Panelinterface> {
    return this.http.get<Panelinterface>(`${this.getUrl}/${_id}`).pipe(catchError(this.handleError));;
  }

  addPanel(Panel: FormData): Observable<Panelinterface> {
    return this.http.post<Panelinterface>(this.addUrl, Panel).pipe(catchError(this.handleError));;
  }

  updatePanel(_id: string, data: Omit<Panelinterface, 'id'>): Observable<Panelinterface> {
    return this.http.put<Panelinterface>(`${this.updateUrl}/${_id}`, data).pipe(catchError(this.handleError));;
  }

  deletePanel(_id: string): Observable<Panelinterface> {
    return this.http.delete<Panelinterface>(`${this.deleteUrl}/${_id}`).pipe(catchError(this.handleError));;
  }

  updatePanelOrder(panels: Panelinterface[]): Observable<Panelinterface[]> {
    return this.http.put<Panelinterface[]>(this.updateOrderUrl, panels).pipe(catchError(this.handleError));;
  }

  notifyPanelRefresh() {
    this.refreshPanelsSubject.next();
  }
}
