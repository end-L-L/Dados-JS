import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FacadeService } from 'src/app/services/facade.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private facadeService: FacadeService
  ) { }

  /* Servicios HTTP */

  // Registar Usuario
  public registrarUsuario (data: any): Observable <any>{
    return this.http.post<any>(`${environment.url_api}/register/`,data, httpOptions);
  }

  // Actualizar Record
  public actualizarRecord (data: any): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.post<any>(`${environment.url_api}/record/`, data, {headers:headers});
  }

  // Obtener Record
  public obtenerRecord (): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.get<any>(`${environment.url_api}/record/`, {headers:headers});
  }
}
