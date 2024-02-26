import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  /* Servicios HTTP */

  // Registar Usuario
  public registrarUsuario (data: any): Observable <any>{
    return this.http.post<any>(`${environment.url_api}/register/`,data, httpOptions);
  }
}
