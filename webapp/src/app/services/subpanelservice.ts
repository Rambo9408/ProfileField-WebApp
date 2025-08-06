import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subpanelinterface } from '../interfaces/subpanelinterface';
import { Observable } from 'rxjs';

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

  getSubPanels(): Observable<Subpanelinterface[]> {
    return this.http.get<Subpanelinterface[]>(this.getUrl);
  }

  getSubPanelById(_id: string): Observable<{data: Subpanelinterface}> {
    return this.http.get<{data: Subpanelinterface}>(`${this.getUrl}/${_id}`);
  }

  addSubPanel(Panel: FormData): Observable<Subpanelinterface> {
    return this.http.post<Subpanelinterface>(this.addUrl, Panel);
  }

  updateSubPanel(_id: string, data: Omit<Subpanelinterface, 'id'>): Observable<Subpanelinterface> {
    return this.http.put<Subpanelinterface>(`${this.updateUrl}/${_id}`, data);
  }

  deleteSubPanel(_id: string): Observable<Subpanelinterface> {
    return this.http.delete<Subpanelinterface>(`${this.deleteUrl}/${_id}`);
  }

  // updateSubPanelOrder(panels: Subpanelinterface[]): Observable<Subpanelinterface[]> {
  //   return this.http.put<Subpanelinterface[]>(this.updateOrderUrl, panels);
  // }
}
