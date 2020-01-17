import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class IntegradorService {

    sinProxy = true
    urlBase = 'https://pullmanapi.pasajeschile.cl'

    constructor(private http: HttpClient) { }

    getCityOrigin(): Observable<any[]> {
        let urlFinal
        let dirProxy = '/integrador-web/rest/private/venta/buscaCiudades'
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy
        return this.http.post<any[]>(urlFinal, {});
    }
    getCityDestination(origen: string): Observable<any[]> {
        let urlFinal
        let dirProxy = '/integrador-web/rest/private/venta/buscarCiudadPorCodigo'
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy
        return this.http.post<any[]>(urlFinal, origen);
    }
    getService(ticket: any): Observable<any[]> {
        let urlFinal
        let dirProxy = '/integrador-web/rest/private/venta/obtenerServicio'
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy
        // console.log('urlFinal', urlFinal);
        // console.log('dataPost', ticket);
        return this.http.post<any[]>(urlFinal, ticket);
    }
    getPlanillaVertical(service: any): Observable<any[]> {
        let urlFinal
        let dirProxy = '/integrador-web/rest/private/venta/buscarPlantillaVertical'
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy
        return this.http.post<any[]>(urlFinal, service);
    }

    validarAsiento(service: any): Observable<any> {
        let urlFinal
        let dirProxy = '/integrador-web/rest/private/venta/validarAsiento'
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy
        return this.http.post<any>(urlFinal, service);
    }

    tomarAsiento(service: any): Observable<any> {
        let urlFinal
        let dirProxy = '/integrador-web/rest/private/venta/tomarAsiento'
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy
        return this.http.post<any>(urlFinal, service);
    }

    liberarAsiento(service: any): Observable<any> {
        let urlFinal
        let dirProxy = '/integrador-web/rest/private/venta/liberarAsiento'
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy
        return this.http.post<any>(urlFinal, service);
    }   

    guardarTransaccion(guardar: any): Observable<any[]> {
        let urlFinal
        let dirProxy = '/integrador-web/rest/private/venta/guardarTransaccion'
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy
        return this.http.post<any[]>(urlFinal, guardar);
    }
}