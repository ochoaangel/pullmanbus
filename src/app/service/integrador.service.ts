import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class IntegradorService {

    constructor(private http: HttpClient) { }

    getCityOrigin(): Observable<any[]> {
        return this.http.post<any[]>('/integrador-web/rest/private/venta/buscaCiudades',{});
    }
    getCityDestination(origen:string): Observable<any[]> {
        return this.http.post<any[]>('/integrador-web/rest/private/venta/buscarCiudadPorCodigo',origen);
    }  
    getService(ticket:any): Observable<any[]> {
        return this.http.post<any[]>('/integrador-web/rest/private/venta/obtenerServicio',ticket);
    }  
    getPlanillaVertical(service:any): Observable<any[]> {
        return this.http.post<any[]>('/integrador-web/rest/private/venta/buscarPlantillaVertical',service);
    }  
}