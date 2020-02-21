import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class IntegradorService {

    sinProxy= true 
    urlBase = 'https://pullmanapi.pasajeschile.cl'
    // urlBase = 'http://clamber.pullman.cl'    

    // sinProxy= false
    //urlBase = 'http://pullmanapi.pasajeschile.cl'
    // urlBase = 'http://clamber.pullman.cl'    
    constructor(private http: HttpClient) { 
    }

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
    
    getListMedioPago(): Observable<any> {        
        let urlFinal
        let dirProxy = '/administracion-web/rest/private/convenio/getConvenio'
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy
        return this.http.post<any>(urlFinal, {});
    }

    getListConvenio(): Observable<any> {        
        let urlFinal
        let dirProxy = '/administracion-web/rest/private/convenio/obtenerInformacion'
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy
        return this.http.post<any>(urlFinal, {});
    }

    getDetalleConvenio(convenio): Observable<any> {        
        let urlFinal
        let dirProxy = '/administracion-web/rest/private/convenio/getDetalleConvenioAtributo'
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy
        return this.http.post<any>(urlFinal, convenio);
    }

    getDescuentoConvenio(convenio): Observable<any> {        
        let urlFinal
        let dirProxy = '/administracion-web/rest/private/convenio/getDescuentoConvenio'
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy
        return this.http.post<any>(urlFinal, convenio);
    }

    guardarTransaccion(guardar: any): Observable<any[]> {
        let urlFinal
        let dirProxy = '/integrador-web/rest/pago/guardarTransaccion'
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy
        return this.http.post<any[]>(urlFinal, guardar);
    }
    buscarEncabezado(buscar: any): Observable<any[]> {
        let urlFinal
        let dirProxy = '/integrador-web/rest/private/venta/buscarEncabezado'
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy
        return this.http.post<any[]>(urlFinal, buscar);
    }

    generarComprobante(params:any): Observable<any[]> {
        let urlFinal
        let dirProxy = '/integrador-web/rest/private/venta/generarComprobante'
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy
        return this.http.post<any[]>(urlFinal, params);
    }
    
    
}

// http://pullmanapi.pasajeschile.cl/