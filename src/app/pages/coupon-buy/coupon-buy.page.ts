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

  cuponPrograma;
  autorizacionRequerida = false;
  autorizadoUsuario;

  myData = {
    integrador: 1001,
    rut: '',
    clave: '',
  };

  payData = {
    email1: '',
    email2: '',
    terminos: false,
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

    // inicializo variables
    this.autorizacionRequerida = false;
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
      const end = this.myData;
      end.rut = end.rut.replace(/\./gi, '');

      this.loading++;
      this.integradorService.autotizarCuponAUsuario(end).subscribe((resp: any) => {
        this.loading--;

        if (resp.programa === this.cupon.programa) {
          this.autorizadoUsuario = resp;
          this.mys.alertShow('¡Éxito!', 'done-all', 'Autorizad@ para la compra de esta cuponera');
          this.autorizacionRequerida = true;

        } else {
          this.mys.alertShow('Verifique', 'alert', 'No está autorizado para compra esta Cuponera..');
          this.autorizacionRequerida = false;
        }


      });
    }

  }



  rutFunction(rawValue) {
    const numbers = rawValue.match(/[0-9kKeE]/g);
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



  continuar() {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.payData.email1)) {
      this.mys.alertShow('Verifique', 'alert', 'Debe ingresar correo válido,<br> Intente nuevamente..');
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.payData.email2)) {
      this.mys.alertShow('Verifique', 'alert', 'Debe re-ingresar un correo válido,<br> Intente nuevamente..');
    } else if (this.payData.email1 !== this.payData.email2) {
      this.mys.alertShow('Verifique', 'alert', 'Los correo deben  ser iguales para continuar,<br> Intente nuevamente..');
    } else {
      // caso cuando se valida los correos, 
      // falta la validación cuando se aceptan los terminos(payData.terminos) y cuando requiere autorización(this.autorizacionRequerida)

      this.mys.alertShow('Verifique', 'alert', 'Correos validados,<br> En desarrollo pago con webpay..');



      // Variables importantes
      // en this.cupon => está el objeto cupon con todos los detalles para su futuro uso
      // en this.myData => estan los datos del usuario cuando es requerido
      // en this.payData => estan los datos del correo y ultimas validaciones para el pago
      // en this.autorizacionRequerida => en true es cuando el cupon reguiere autorizacion y ya está validado el usuario
    }


  }





}
