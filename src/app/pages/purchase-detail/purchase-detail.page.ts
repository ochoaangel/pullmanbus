import { Component, OnInit } from "@angular/core";
import { MyserviceService } from "src/app/service/myservice.service";
import { Router } from "@angular/router";
import { PopMenuComponent } from 'src/app/components/pop-menu/pop-menu.component';
import { PopoverController } from '@ionic/angular';
import { PopCartComponent } from 'src/app/components/pop-cart/pop-cart.component';
import { IntegradorService } from 'src/app/service/integrador.service';

@Component({
  selector: "app-purchase-detail",
  templateUrl: "./purchase-detail.page.html",
  styleUrls: ["./purchase-detail.page.scss"]
})
export class PurchaseDetailPage implements OnInit {
  constructor(private router: Router, private mys: MyserviceService, private popoverCtrl: PopoverController,
    private integradorService: IntegradorService,
  ) { }

  ticket;
  way;
  tarifaTotal;
  eliminadoAsiento = false;
  loading = false


  ngOnInit() {

    if (this.mys.ticket) {
      this.ticket = this.mys.ticket;
      this.way = this.mys.way;

      let total_general = 0;
      this.ticket.comprasDetalles.forEach(element => {
        total_general = total_general + element.valor;
      });
      this.tarifaTotal = total_general;


    } else {
      // solo pruebas
      console.log('Ejecutando con info de prueba');
      this.ticket = {
        origin: { nombre: "ALTO HOSPICIO", codigo: "01101002", region: null },
        destiny: { nombre: "CABRERO", codigo: "08303194", region: null },
        tripType: "goBack",
        goDate: "2019-12-28T22:34:20.295-04:00",
        backDate: "2019-12-29T22:36:28.833-04:00",
        goTotal: 21000,
        backTotal: 44000,
        goCompras: ["21", "28", "33"],
        backCompras: ["21", "28", "33"],
        goService: {
          empresa: "01",
          fechaSalida: "13/12/2019",
          horaSalida: "20:30",
          terminalSalida: "TERMINAL BORJA",
          horaLlegada: "03:00",
          fechaLlegada: "14/12/2019",
          terminaLlegada: "COPIAPO",
          servicioPrimerPiso: "SALON CAMA",
          tarifaPrimerPiso: "8.000",
          tarifaPrimerPisoInternet: "10.000",
          servicioSegundoPiso: "SEMI CAMA",
          tarifaSegundoPiso: "7.000",
          tarifaSegundoPisoInternet: "9.000",
          idServicio: "BUSS8",
          idTerminalOrigen: "MA",
          idTerminalDestino: "D3",
          idClaseBusPisoUno: "SAL09",
          idClaseBusPisoDos: "SEM42",
          logo:
            "iVBORw0KGgoAAAANSUhEUgAAAG0AAAAZCAYAAAA7S6CBAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAABZ9JREFUeNrsWmlQVWUYfi4parngCI5KmdVkWZkUuI7mQuRe4ob7lkq5jeaeaYOEGqalWZOpmQuN0qioMVI4hhuhQoQLLogiIly8YBg7916efrxcvnMUWn5578x5Zr65533O+23v833ffc+9x0QSBlwLdQAAfiYA8ASwCEAQAG8jNE6DOwD2AggHkIdEwkQS8DN5AYgF0MGIkdMiBUAAEmlxqyJWGII5PTpU6QSHaEFGTFwCQVrRvIx4uAS8tKJVGvFwCVRqRTPgQjBEc9nntJpQrwFwIA1oXssjm80KHIkAQt8FKv/j6epeH9h/FWjRWuy1cwCf7kDASLGP7QMWDXfeaM1cBUxeWvv9m5eBD0cBaecf0U4bv0AJVlIE5NySUlJUJXddYPAkoHXb/5H7zFKCZaUDl5OUYHYbsGmp8wrW8mlg7Dxl714HfBsi5cYl4Z5pBwya+Ih2mlcrYOJiZS8aBiT8Itf+w4FPf5TrfDNQVgKMmat8T0UDmWlAt35AmxeFKysFjkYCU5Ypvy+XALNWKXvfZsDDC+g+UGwSiIsC2ncBGjUF7ucDSXHSX8c+QPMn5TrlNHD7utRp0gzoHAB4tgAqyoHsDODsUSBwGlDXXXyuXwTuZsn4HIiPAZ57Reb91z0gMU58tJi9Rk4KAIiNBL5YINeNPAD/YcrvQgIwYBzg4Sm2ORM4tl/adixQADhxGCgpBPz6AI2bAu71albIEU8tSIK+sNMXrC4Hv2M1riaTo32kBPcmb6Sqe2HBet+8HLL7E6S/J1l0X/HbPiF3fabsCwnkvLeVXVxIDniKzLmluJIi0lpBHQoLpA8trBVkf29yag99nw6kJurtCZ3IpDhlV1ZKXw/207W+isekLvr7f1rI7AwyN4u0WYUrLyUjvyInd9P7LhsjbRzarrjc2+RbLaT+PyHfTPZoSI02dpI1iDbaRybybzh+iBzdQe8bFixt7Nmo6TiXHPESWV6muOm9yPRLyv76I3LDQr0Qs/pKPbtd8dE7ycFtyJgfFFeQR/ZtqcTMN5Phs8mQyeS+zfoxH4kg5w7ScysmSJvaxXAjlfQzyVz8TGRKvH4RxEWRxw+S5kzFn/9N/JNPKu5yktQPaq+P0/Lx5PbV+nHYbeTaOeTCoeT8IeTQF2QDaDdTraKdO6ZZEVnk1T80JZmMj5GgdK5Lnj6ifO/cJDvVIQOf1++QNTPI6F16sUOnKtuSLTulsEBxEetlLGtmKO7+PbKXB/lGYxHKgXVzyW1hyt6yUvy6NSA3LlZ8eamIk35RcScOSz8zAvQBnDdYBWppkOLv3SV7NlH3ItbrF9T8Ifp2ZvcTv/gY/cnV0Y1cECiLKC5KinYRk+SZow8KVotoH7yjn+TA1jVVlPK+v76T0mLyVLTsLAfSL5LjfNUqs9vIMa+JUA6ETiV3r9MfTX2aybGgXf2fz5d+t4YqLiud7OJOnol9+CQImSJCa49o7WKx28gRL8tOuPK74pOOqzl2rS/HoAPZGSrIySfVvGxWctSrZMYV/RgunZWvAi2Ce8s4Dn+vSvROMjNN77d8HLnqPTJs+kOi6RORkTMlQwSAn3bIl2ht8H4WuJbyQALjDeTlSMm+CWxYCExaotr59QDQzhewVkg/5kxJNgKnqbaitkrS0X8skJ8rpagAiNwEPN4Q8OutfLeESFvffCyPIJ6thM+4Ari5SfvmTKC0CNgRDqzeo+om/CxZ3+s9AZOb4h0JBgD0HSWfjpgAQFsffYpfYAH2bATu3pHMWhuTOlXJz7UUoKwYOLQdSD0njw71GuhjV1osfjarJH2xkcC0FYDN9lDoHX/N2I0HbRf5GSuRjxlCufDPWIZ4LqSXQyyLEQ+XgEUr2l4jHi6BvVrRVkLeQTDgvEip0qk65bcAeBPG21jOCP3bWNUpvwGXwt8DAJYnxSpmNbz0AAAAAElFTkSuQmCC",
          busPiso1: "4",
          busPiso2: "4",
          integrador: 1000,
          fechaServicio: "13/12/2019",
          ruta: null,
          checked: true
        },
        backService: {
          empresa: "01",
          fechaSalida: "13/12/2019",
          horaSalida: "20:30",
          terminalSalida: "TERMINAL BORJA",
          horaLlegada: "03:00",
          fechaLlegada: "14/12/2019",
          terminaLlegada: "COPIAPO",
          servicioPrimerPiso: "SALON CAMA",
          tarifaPrimerPiso: "8.000",
          tarifaPrimerPisoInternet: "10.000",
          servicioSegundoPiso: "SEMI CAMA",
          tarifaSegundoPiso: "7.000",
          tarifaSegundoPisoInternet: "9.000",
          idServicio: "BUSS8",
          idTerminalOrigen: "MA",
          idTerminalDestino: "D3",
          idClaseBusPisoUno: "SAL09",
          idClaseBusPisoDos: "SEM42",
          logo:
            "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",
          busPiso1: "4",
          busPiso2: "4",
          integrador: 1000,
          fechaServicio: "13/12/2019",
          ruta: null,
          checked: true
        }
      };
      this.way = "back";
    }

    // console.log('this.ticket(iniciando purchase-detail)', this.ticket);
    // console.log('this.way(iniciando purchase-detail)', this.way);
    console.log('this.ticket', this.ticket);



  }  // fin ngOnInit

  continuar() {

    if (this.tarifaTotal === 0) {
      this.mys.ticket = null;
      this.router.navigateByUrl('/home');
    } else if ((this.ticket.tripType === 'goBack' && this.way === 'back') || (this.ticket.tripType === 'goOnly')) {
      this.mys.total = this.tarifaTotal;
      this.router.navigateByUrl('/payment-methods');
      this.mys.ticket = this.ticket;
    } else if (this.ticket.tripType === 'goBack' && this.way === 'go') {

      this.way = 'back'
      this.mys.way = this.way;
      this.mys.ticket = this.ticket;
      this.router.navigateByUrl('/ticket');
    }
    // console.log('this.ticket(saliendo de purchace-detail)', this.ticket);
    // console.log('this.way(saliendo de purchace-detail)', this.way);


  }// fin continuar

  EliminarPasaje(way, idServicio, asiento) {
    let texto = way + '_' + idServicio + '_' + asiento
    console.log('asiento a eliminar', texto);

    let index = this.ticket.comprasDetallesPosicion.indexOf(texto);
    console.log('index', index)
    if (index !== -1) {
      console.log('************************************************************');
      console.log('asiento a eliminarrrrrrr', this.ticket.comprasDetalles[index]);

      let asiento = {
        "servicio": this.ticket.comprasDetalles[index].idServicio,
        "fecha": this.ticket.comprasDetalles[index].service.fechaSalida,
        "origen": this.ticket.comprasDetalles[index].service.idTerminalOrigen,
        "destino": this.ticket.comprasDetalles[index].service.idTerminalDestino,
        "asiento": this.ticket.comprasDetalles[index].asiento,
        "integrador": this.ticket.comprasDetalles[index].service.integrador
      }
      this.loading = true
      this.integradorService.liberarAsiento(asiento).subscribe(resp => {
        this.loading = false
      })



      this.ticket.comprasDetallesPosicion.splice(index, 1);
      this.ticket.comprasDetalles.splice(index, 1);
    }

    if (way === 'go') {
      let index2 = this.ticket.goCompras.indexOf(texto);
      if (index2 !== -1) { this.ticket.goCompras.splice(index2, 1); }
    } else {
      let index3 = this.ticket.backCompras.indexOf(texto);
      if (index3 !== -1) { this.ticket.backCompras.splice(index3, 1); }
    }

    console.log('this.ticket.comprasDetallesPosicion', this.ticket.comprasDetallesPosicion);
    let index4 = this.ticket.comprasDetallesPosicion.indexOf(texto);
    console.log('index4', index4);
    if (index4 !== -1) {
      this.ticket.comprasDetalles.splice(index4, 1);
      this.ticket.comprasDetallesPosicion.splice(index4, 1);
      this.mys.ticket = this.ticket;
    }

    console.log('this.ticket', this.ticket);

    let total_general = 0;
    this.ticket.comprasDetalles.forEach(element => {
      total_general = total_general + element.valor;
    });
    this.tarifaTotal = total_general;
    this.mys.ticket = this.ticket;
    this.eliminadoAsiento = true;
  }

  volver() {
    if (this.eliminadoAsiento) {
      this.router.navigateByUrl('/home');
    } else {
      this.mys.regresandoAticket = true;
      this.router.navigateByUrl('/ticket');
    }

  }

  async popMenu(event) {
    const popoverMenu = await this.popoverCtrl.create({
      component: PopMenuComponent,
      event,
      mode: 'ios',
      backdropDismiss: true,
      cssClass: "popMenu"
    });
    await popoverMenu.present();

    // recibo la variable desde el popover y la guardo en data
    const { data } = await popoverMenu.onWillDismiss();
    this.router.navigateByUrl(data.destino);
  }

  async popCart(event) {
    this.mys.temporalComprasCarrito = this.ticket.comprasDetalles
    const popoverCart = await this.popoverCtrl.create({
      component: PopCartComponent,
      event,
      mode: 'ios',
      backdropDismiss: true,
      cssClass: "popCart"
    });
    await popoverCart.present();

    // recibo la variable desde el popover y la guardo en data
    // const { data } = await popoverCart.onWillDismiss();
    // this.router.navigateByUrl(data.destino);
  }


}


//////////////////////////////////////////////////////////////////////////////////////
