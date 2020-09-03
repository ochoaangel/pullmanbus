import { Component, OnInit } from '@angular/core';
import { IntegradorService } from 'src/app/service/integrador.service';
import { MyserviceService } from 'src/app/service/myservice.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-coupon-buy',
  templateUrl: './coupon-buy.page.html',
  styleUrls: ['./coupon-buy.page.scss'],
})
export class CouponBuyPage implements OnInit {

  loading = 0;

  cupon;
  // cupon = {
  //   empresa: "03",
  //   empresaDescripcion: "ASOCIACION PULLMAN",
  //   empresaLogo: "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",
  //   ruta: "73",
  //   rutaDescripcion: " TRONCAL PALMAS",
  //   clase: "SEM",
  //   claseDescripcion: "SEMI CAMA",
  //   programa: "PREMIUM",
  //   boletos: 20,
  //   distribucion: "10 Ida y 10 Regreso",
  //   valorBoleto: 3000,
  //   total: 60000,
  //   condiciones: "<p class=MsoNormal style='text-align:justify'>Los pasajes adquiridos deben ser confirmados para ser validos (hasta una hora antes de la salida del bus, siempre y cuando exista disponibilidad de asientos). Su anulación se acepta hasta 4 horas antes de la partida, para el caso de los que ya se encuentren confirmados y hasta 90 días para el caso de los boletos sin confirmar (Art. 67 D.S 212/1992 Min. Ttes.). Si pago con efectivo o con tarjeta (de crédito, débito u otra similar) se devolverá el 85% de su valor.<span style='mso-spacerun:yes'></span></p><p class=MsoNormal style='text-align:justify'>Pasajes nominativos, solo pueden ser utilizados por el titular de la cuenta, su uso indebido podría generar el bloqueo del cliente asociado<span style='mso-spacerun:yes'></span>a dichos boletos.</p><p class=MsoNormal style='text-align:justify'>Si usted estima que el valor de los objetos que transporta en la cámara portaequipajes, exceden a 5 UTM, está obligado a declarar por escrito las especies en el formulario que para ese efecto está a su disposición en la oficina de salida, pudiendo la empresa verificar la exactitud de ellas. Igual declaración podrá efectuar en los demás casos que Ud. Desee (Art. 70 D.S. 212/1992 Min. Ttes.). La empresa no se responsabiliza por pérdidas superiores si no están declaradas. Las valijas, bultos, paquetes, etc., que se lleven en las parrillas portaequipajes interiores del bus, son de cuidado y responsabilidad de los pasajeros (Art. 70 D.S. 212/1992 Min. <span class=SpellE>Ttes</span>.), por lo que la empresa no se hace responsable por su perdida, hurto o extravío. El transporte de animales está prohibido en el interior del bus. Para transportarlos en la cámara portaequipaje, deberán guardarse en jaula segura que proporcione el pasajero. El horario de llegada es estimado. El viaje se efectuara directo de terminal origen a terminal de llegada. Las paradas en la ruta constituyen una mera liberalidad de la empresa.Equipaje en maleteros: La carga y descarga de equipaje en maleteros solo se efectuara en Terminales de origen y de llegada. Casa MATRIZ: Nicasio Retamales 71 Estación Central, fono: 227904700, Consultas o reclamos al mail: reclamos@pullmancosta.cl</p>",
  //   descripcion: "SEM16-SEM44 - TRONCAL PALMAS",
  //   requiereAutenticacion: true,
  //   // requiereAutenticacion: false,
  // }

  cuponPrograma;
  autorizadoUsuario;

  myData = {
    integrador: 1001,
    rut: '',
    clave: '',
  };

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    public mys: MyserviceService,
    private integradorService: IntegradorService,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.cupon = null;
    if (!this.mys.initCouponBuy && !this.mys.initCouponResult) {
      this.router.navigateByUrl('/electronic-coupon');
    } else if (!this.mys.initCouponBuy && this.mys.initCouponResult) {
      this.router.navigateByUrl('/coupon-result');
    } else {
      this.cupon = this.mys.initCouponBuy;
    }
  }


  validar() {
    console.log('Validando..', this.myData);

    if (!this.myData.rut || !this.myData.clave) {
      this.mys.alertShow('Verifique', 'alert', 'Debe ingresar RUT y su clave para validar,<br> Intente nuevamente..');
    } else if (this.myData.clave.length > 8 || this.myData.clave.length < 4) {
      this.mys.alertShow('Verifique', 'alert', 'Recuede que la clave debe ser entre 4 y 8 caracteres,<br> Intente nuevamente..');
    } else {
      let end = this.myData;
      end.rut = end.rut.replace(/\./gi, '');
      console.log('validado->', end);

      this.loading++;
      this.integradorService.autotizarCuponAUsuario(end).subscribe((resp: any) => {
        this.loading--;
        console.log('resp', resp);


        if (resp.programa === this.cupon.programa) {
          this.autorizadoUsuario = resp;
          this.mys.alertShow('¡Éxito!', 'done-all', 'Autorizado para la compra de esta cuponera');

        } else {
          this.mys.alertShow('Verifique', 'alert', 'No está autorizado para compra esta Cuponera..');


        }


      })
    }

  }



  rutFunction(rawValue) {
    let numbers = rawValue.match(/[0-9kKeE]/g);
    let numberLength = 0;
    if (numbers) {
      numberLength = numbers.join('').length;
    }
    if (numberLength > 8) {
      return [/[1-9]/, /[0-9]/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /[0-9KkEe]/];
    } else {
      return [/[1-9]/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /[0-9KkEe]/];
    }
  }








}
