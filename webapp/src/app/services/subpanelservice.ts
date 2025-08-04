import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Panelinterface } from '../interfaces/panelinterface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Subpanelservice {
  private getUrl = "http://localhost:3000/api/subPanel";
  private addUrl = "http://localhost:3000/api/addSubPanel";
  private updateUrl = "http://localhost:3000/api/updateSubPanel";
  private updateOrderUrl = "http://localhost:3000/api/updateSubPanelOrder";
  private deleteUrl = "http://localhost:3000/api/deleteSubPanel";

  constructor(private http: HttpClient) { }

  getSubPanels(): Observable<Panelinterface[]> {
    return this.http.get<Panelinterface[]>(this.getUrl);
  }

  getSubPanelById(_id: string): Observable<Panelinterface> {
    return this.http.get<Panelinterface>(`${this.getUrl}/${_id}`);
  }

  addSubPanel(Panel: FormData): Observable<Panelinterface> {
    return this.http.post<Panelinterface>(this.addUrl, Panel);
  }

  updateSubPanel(_id: string, data: Omit<Panelinterface, 'id'>): Observable<Panelinterface> {
    return this.http.put<Panelinterface>(`${this.updateUrl}/${_id}`, data);
  }

  deleteSubPanel(_id: string): Observable<Panelinterface> {
    return this.http.delete<Panelinterface>(`${this.deleteUrl}/${_id}`);
  }

  updateSubPanelOrder(panels: Panelinterface[]): Observable<Panelinterface[]> {
    return this.http.put<Panelinterface[]>(this.updateOrderUrl, panels);
  }
}
