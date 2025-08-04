import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Panelinterface } from '../interfaces/panelinterface';
import { BehaviorSubject, Observable } from 'rxjs';

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

  getPanels(): Observable<Panelinterface[]> {
    return this.http.get<Panelinterface[]>(this.getUrl);
  }

  getPanelById(_id: string): Observable<Panelinterface> {
    return this.http.get<Panelinterface>(`${this.getUrl}/${_id}`);
  }

  addPanel(Panel: FormData): Observable<Panelinterface> {
    return this.http.post<Panelinterface>(this.addUrl, Panel);
  }

  updatePanel(_id: string, data: Omit<Panelinterface, 'id'>): Observable<Panelinterface> {
    return this.http.put<Panelinterface>(`${this.updateUrl}/${_id}`, data);
  }

  deletePanel(_id: string): Observable<Panelinterface> {
    return this.http.delete<Panelinterface>(`${this.deleteUrl}/${_id}`);
  }

  updatePanelOrder(panels: Panelinterface[]): Observable<Panelinterface[]> {
    return this.http.put<Panelinterface[]>(this.updateOrderUrl, panels);
  }

  notifyPanelRefresh() {
    this.refreshPanelsSubject.next();
  }
}
