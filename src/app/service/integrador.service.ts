import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class IntegradorService {

    sinProxy = true;
    urlBase = 'https://pullmanapi.pasajeschile.cl';
    // urlBase = 'http://clamber.pullman.cl'    

    // sinProxy= false 
    //urlBase = 'http://pullmanapi.pasajeschile.cl'
    // urlBase = 'http://clamber.pullman.cl'    
    constructor(private http: HttpClient) {
    }


    getCityOrigin(): Observable<any[]> {
        let urlFinal;
        let dirProxy = '/integrador-web/rest/private/venta/buscaCiudades';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any[]>(urlFinal, {});
    }

    getCityDestination(origen: string): Observable<any[]> {
        let urlFinal;
        let dirProxy = '/integrador-web/rest/private/venta/buscarCiudadPorCodigo';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any[]>(urlFinal, origen);
    }

    getService(ticket: any): Observable<any[]> {
        let urlFinal;
        console.log('XXXXXXXXXXXXX_', JSON.stringify(ticket));
        let dirProxy = '/integrador-web/rest/private/venta/obtenerServicio';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any[]>(urlFinal, ticket);
    }

    getPlanillaVertical(service: any): Observable<any[]> {
        let urlFinal;
        let dirProxy = '/integrador-web/rest/private/venta/buscarPlantillaVertical';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any[]>(urlFinal, service);
    }

    validarAsiento(service: any): Observable<any> {
        let urlFinal;
        let dirProxy = '/integrador-web/rest/private/venta/validarAsiento';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any>(urlFinal, service);
    }

    tomarAsiento(service: any): Observable<any> {
        let urlFinal;
        let dirProxy = '/integrador-web/rest/private/venta/tomarAsiento';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any>(urlFinal, service);
    }

    liberarAsiento(service: any): Observable<any> {
        let urlFinal;
        let dirProxy = '/integrador-web/rest/private/venta/liberarAsiento';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any>(urlFinal, service);
    }

    getListMedioPago(): Observable<any> {
        let urlFinal;
        let dirProxy = '/administracion-web/rest/private/convenio/getConvenio';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any>(urlFinal, {});
    }

    getListConvenio(): Observable<any> {
        let urlFinal;
        let dirProxy = '/administracion-web/rest/private/convenio/obtenerInformacion';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any>(urlFinal, {});
    }

    getDetalleConvenio(convenio): Observable<any> {
        let urlFinal;
        let dirProxy = '/administracion-web/rest/private/convenio/getDetalleConvenioAtributo';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any>(urlFinal, convenio);
    }

    getDescuentoConvenio(convenio): Observable<any> {
        let urlFinal;
        let dirProxy = '/administracion-web/rest/private/convenio/getDescuentoConvenio';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any>(urlFinal, convenio);
    }

    guardarTransaccion(guardar: any): Observable<any[]> {
        let urlFinal;
        let dirProxy = '/integrador-web/rest/pago/guardarTransaccion';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any[]>(urlFinal, guardar);
    }
    buscarEncabezado(buscar: any): Observable<any[]> {
        let urlFinal;
        let dirProxy = '/integrador-web/rest/private/venta/buscarEncabezado';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any[]>(urlFinal, buscar);
    }

    generarComprobante(params: any): Observable<any[]> {
        let urlFinal;
        let dirProxy = '/integrador-web/rest/private/venta/generarComprobante';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any[]>(urlFinal, params);
    }


    ///////////////////////////////////////////////////////////////////////////////////
    //////////////////////// Gestion de Usuario ///////////////////////////////////////
    autenticarLogin(params: any): Observable<any[]> {
        let urlFinal;
        let dirProxy = '/srv-privado-web/rest/usuario/autenticar';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any[]>(urlFinal, params);
    }

    usuarioCambiarPassword(params: any): Observable<any[]> {
        let urlFinal;
        let dirProxy = '/srv-privado-web/rest/usuario/cambioPassowrd';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any[]>(urlFinal, params);
    }

    usuarioGuardar(params: any): Observable<any[]> {
        let urlFinal;
        let dirProxy = '/srv-privado-web/rest/usuario/guardarUsuario';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any[]>(urlFinal, params);
    }

    usuarioInscribir(params: any): Observable<any[]> {
        let urlFinal;
        let dirProxy = '/srv-privado-web/rest/usuario/inscribirUsuario';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any[]>(urlFinal, params);
    }


    usuarioRecuperarPassword(params: any): Observable<any[]> {
        let urlFinal;
        let dirProxy = '/srv-privado-web/rest/usuario/recuperarPassword';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any[]>(urlFinal, params);
    }

    ///////////////////////////////////////////////////////////////////////////////////
    //////////////////////// Gestion de Boletos ///////////////////////////////////////

    buscarTransaccionPorEmail(params: any): Observable<any[]> {
        let urlFinal;
        let dirProxy = '/srv-privado-web/rest/compra/obtenerTransacciones';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any[]>(urlFinal, params);
    }

    buscarBoletoPorCodigo(params: any): Observable<any[]> {
        let urlFinal;
        let dirProxy = '/srv-privado-web/rest/compra/obtenerBoleto';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any[]>(urlFinal, params);
    }

    anularBoleto(params: any): Observable<any[]> {
        let urlFinal;
        let dirProxy = '/integrador-web/rest/private/venta/anularVenta';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any[]>(urlFinal, params);
    }
    ///////////////////////////////////////////////////////////////////////////////////
    //////////////////////// Gestion localidades ///////////////////////////////////////

    buscarRegionesRegistroDeUsuario(): Observable<any[]> {
        let urlFinal;
        let dirProxy = '/srv-privado-web/rest/parametros/obtenerRegiones';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any[]>(urlFinal, {});
    }

    buscarCiudadPorRegionesRegistroDeUsuario(params: any): Observable<any[]> {
        let urlFinal;
        let dirProxy = '/srv-privado-web/rest/parametros/obtenerCiudades';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any[]>(urlFinal, params);
    }
    ///////////////////////////////////////////////////////////////////////////////////
    //////////////////////// Gestion bancos ///////////////////////////////////////

    buscarBancos(): Observable<any[]> {
        let urlFinal;
        let dirProxy = '/srv-privado-web/rest/parametros/obtenerBanco';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any[]>(urlFinal, '');
    }

    buscarTipoDeCuentas(params: any): Observable<any[]> {
        let urlFinal;
        let dirProxy = '/srv-privado-web/rest/parametros/obtenerTipoCuenta';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any[]>(urlFinal, params);
    }
    ///////////////////////////////////////////////////////////////////////////////////
    //////////////////////// Canje Boletos ///////////////////////////////////////


    canjeValidar(params: any): Observable<any[]> {
        let urlFinal;
        let dirProxy = '/srv-privado-web/rest/compra/validarBoletoCanje';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any[]>(urlFinal, params);
    }

    canjeBoleto(params): Observable<any[]> {
        let urlFinal;
        let dirProxy = '/srv-privado-web/rest/compra/canjearBoletoCanje';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any[]>(urlFinal, params);
    }

    canjeGenerarComprobante(params: any): Observable<any[]> {
        let urlFinal;
        let dirProxy = '/srv-privado-web/rest/compra/generarComprobante';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any[]>(urlFinal, params);
    }

    canjeBuscarInfoBoleto(params: any): Observable<any[]> {
        let urlFinal;
        let dirProxy = '/srv-privado-web/rest/compra/buscarBoleto';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any[]>(urlFinal, params);
    }

    buscarCarrusel(): Observable<any[]> {
        let urlFinal;
        let dirProxy = '/administracion-web/rest/private/contenido/obtenerSeccion';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        let params = { "portal": { "id": 5 }, "portalSeccion": { "id": "2" } };
        return this.http.post<any[]>(urlFinal, params);
    }


    ///////////////////////////////////////////////////////////////////////////////////////
    // promociones

    buscaCaluga(params: any): Observable<any[]> {
        let urlFinal;
        let dirProxy = '/administracion-web/rest/private/contenido/buscarCaluga';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.post<any[]>(urlFinal, params);
    }


    ///////////////////////////////////////////////////////////////////////////////////////
    // OTROS


    getFaq(): Observable<any[]> {
        let urlFinal;
        let dirProxy = '/srv-privado-web/rest/parametros/obtenerFaq';
        this.sinProxy ? urlFinal = this.urlBase + dirProxy : urlFinal = dirProxy;
        return this.http.get<any[]>(urlFinal);
    }

    getAgencies(): Observable<any[]> {
        let urlFinal = `http://servicios.pullmanbus.cl/serviciosVenta/rest/Servicios/datosAgencia/codciudad=13101420`;
        return this.http.get<any[]>(urlFinal);
    }





}

// http://pullmanapi.pasajeschile.cl/