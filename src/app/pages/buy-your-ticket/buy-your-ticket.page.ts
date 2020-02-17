import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import * as _ from 'underscore';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { MyserviceService } from 'src/app/service/myservice.service';
import { IntegradorService } from 'src/app/service/integrador.service';
import { PopoverController } from '@ionic/angular';
import { PopMenuComponent } from 'src/app/components/pop-menu/pop-menu.component';
import { PopCartComponent } from 'src/app/components/pop-cart/pop-cart.component';



@Component({
  selector: 'app-buy-your-ticket',
  templateUrl: './buy-your-ticket.page.html',
  styleUrls: ['./buy-your-ticket.page.scss']
})

export class BuyYourTicketPage implements OnInit {

  ticket;

  showSelection = false;
  mySelection = ''

  allOrigin = [];
  allDestiny = [];

  myOrigin
  myDestiny

  selectOrigin;
  selectDestiny;


  loading = false;

  goDate;
  backDate;

  mingoDate;
  maxgoDate;
  minbackDate;
  maxbackDate;

  stringgoDate;
  stringbackDate;

  // condiciones iniciales
  goOnly = true;
  goBack = false;

  inputFiltrado;
  inputFuente = [
    {
      "nombre": "ALERCE",
      "codigo": "10101324",
      "region": null
    },
    {
      "nombre": "ALGARROBO",
      "codigo": "05602048",
      "region": null
    },
    {
      "nombre": "ALTO HOSPICIO",
      "codigo": "01101002",
      "region": null
    },
    {
      "nombre": "ANGOL",
      "codigo": "09201252",
      "region": null
    },
    {
      "nombre": "ANTOFAGASTA",
      "codigo": "02101007",
      "region": null
    },
    {
      "nombre": "ANTUCO",
      "codigo": "08302189",
      "region": null
    },
    {
      "nombre": "ARICA",
      "codigo": "01201001",
      "region": null
    },
    {
      "nombre": "BAQUEDANO",
      "codigo": "02103424",
      "region": null
    },
    {
      "nombre": "CALAMA",
      "codigo": "02201010",
      "region": null
    },
    {
      "nombre": "CALBUCO",
      "codigo": "10102297",
      "region": null
    },
    {
      "nombre": "CALDERA",
      "codigo": "03102017",
      "region": null
    },
    {
      "nombre": "CANELA BAJA",
      "codigo": "04202031",
      "region": null
    },
    {
      "nombre": "CARAHUE",
      "codigo": "09102253",
      "region": null
    },
    {
      "nombre": "CARTAGENA",
      "codigo": "05603055",
      "region": null
    },
    {
      "nombre": "CASTRO",
      "codigo": "10201298",
      "region": null
    },
    {
      "nombre": "CATEMU",
      "codigo": "05702058",
      "region": null
    },
    {
      "nombre": "CAUQUENES",
      "codigo": "07201148",
      "region": null
    },
    {
      "nombre": "CHAÑARAL",
      "codigo": "03201018",
      "region": null
    },
    {
      "nombre": "CHILLAN",
      "codigo": "08401197",
      "region": null
    },
    {
      "nombre": "CHUQUICAMATA",
      "codigo": "02201011",
      "region": null
    },
    {
      "nombre": "COLLIPULLI",
      "codigo": "09202255",
      "region": null
    },
    {
      "nombre": "COMBARBALA",
      "codigo": "04302032",
      "region": null
    },
    {
      "nombre": "CONCEPCION",
      "codigo": "08101201",
      "region": null
    },
    {
      "nombre": "CONTULMO",
      "codigo": "08204202",
      "region": null
    },
    {
      "nombre": "COPIAPO",
      "codigo": "03101020",
      "region": null
    },
    {
      "nombre": "COQUIMBO",
      "codigo": "04102033",
      "region": null
    },
    {
      "nombre": "CORONEL",
      "codigo": "08102203",
      "region": null
    },
    {
      "nombre": "CURICO",
      "codigo": "07301156",
      "region": null
    },
    {
      "nombre": "DIEGO DE ALMAGRO",
      "codigo": "03202021",
      "region": null
    },
    {
      "nombre": "EL MELON",
      "codigo": "05506074",
      "region": null
    },
    {
      "nombre": "EL QUISCO",
      "codigo": "05604059",
      "region": null
    },
    {
      "nombre": "EL SALADO",
      "codigo": "03201019",
      "region": null
    },
    {
      "nombre": "EL SALVADOR",
      "codigo": "03202022",
      "region": null
    },
    {
      "nombre": "EL TABO",
      "codigo": "05605060",
      "region": null
    },
    {
      "nombre": "FREIRE",
      "codigo": "09105263",
      "region": null
    },
    {
      "nombre": "FRUTILLAR",
      "codigo": "10105304",
      "region": null
    },
    {
      "nombre": "GORBEA",
      "codigo": "09107266",
      "region": null
    },
    {
      "nombre": "HIJUELAS",
      "codigo": "05503062",
      "region": null
    },
    {
      "nombre": "HUERTOS FAMILIARES",
      "codigo": "13303422",
      "region": null
    },
    {
      "nombre": "ILLAPEL",
      "codigo": "04201036",
      "region": null
    },
    {
      "nombre": "IQUIQUE",
      "codigo": "01101003",
      "region": null
    },
    {
      "nombre": "LA BOCA",
      "codigo": "06205126",
      "region": null
    },
    {
      "nombre": "LA CALERA",
      "codigo": "05502052",
      "region": null
    },
    {
      "nombre": "LA LAGUNA DE ZAPALLAR",
      "codigo": "05405101",
      "region": null
    },
    {
      "nombre": "LA SERENA",
      "codigo": "04101037",
      "region": null
    },
    {
      "nombre": "LA UNION",
      "codigo": "10504308",
      "region": null
    },
    {
      "nombre": "LA VEGA DE PUPUYA",
      "codigo": "06205127",
      "region": null
    },
    {
      "nombre": "LAMPA",
      "codigo": "13302379",
      "region": null
    },
    {
      "nombre": "LANCO",
      "codigo": "10506310",
      "region": null
    },
    {
      "nombre": "LAS CABRAS",
      "codigo": "06107113",
      "region": null
    },
    {
      "nombre": "LAS CAMELIAS",
      "codigo": "07405201",
      "region": null
    },
    {
      "nombre": "LAUTARO",
      "codigo": "09108268",
      "region": null
    },
    {
      "nombre": "LIMACHE",
      "codigo": "05505069",
      "region": null
    },
    {
      "nombre": "LINARES",
      "codigo": "07401162",
      "region": null
    },
    {
      "nombre": "LLAILLAY",
      "codigo": "05703070",
      "region": null
    },
    {
      "nombre": "LLANQUIHUE",
      "codigo": "10107312",
      "region": null
    },
    {
      "nombre": "LONCOCHE",
      "codigo": "09109271",
      "region": null
    },
    {
      "nombre": "LONGAVI",
      "codigo": "07403163",
      "region": null
    },
    {
      "nombre": "LOS ANDES",
      "codigo": "05301071",
      "region": null
    },
    {
      "nombre": "LOS ANGELES",
      "codigo": "08301213",
      "region": null
    },
    {
      "nombre": "LOS LAGOS",
      "codigo": "10507313",
      "region": null
    },
    {
      "nombre": "LOS SAUCES",
      "codigo": "09206273",
      "region": null
    },
    {
      "nombre": "LOS VILOS",
      "codigo": "04203038",
      "region": null
    },
    {
      "nombre": "LOTA",
      "codigo": "08106214",
      "region": null
    },
    {
      "nombre": "MAITENCILLO",
      "codigo": "05105082",
      "region": null
    },
    {
      "nombre": "MARIA ELENA",
      "codigo": "02302012",
      "region": null
    },
    {
      "nombre": "MEJILLONES",
      "codigo": "02102014",
      "region": null
    },
    {
      "nombre": "MELIPILLA",
      "codigo": "13501390",
      "region": null
    },
    {
      "nombre": "MULCHEN",
      "codigo": "08305215",
      "region": null
    },
    {
      "nombre": "NACIMIENTO",
      "codigo": "08306216",
      "region": null
    },
    {
      "nombre": "NEGRETE",
      "codigo": "08307217",
      "region": null
    },
    {
      "nombre": "NUEVA IMPERIAL",
      "codigo": "09111278",
      "region": null
    },
    {
      "nombre": "OLMUE",
      "codigo": "05507076",
      "region": null
    },
    {
      "nombre": "OSORNO",
      "codigo": "10301319",
      "region": null
    },
    {
      "nombre": "OVALLE",
      "codigo": "04301044",
      "region": null
    },
    {
      "nombre": "PAILLACO",
      "codigo": "10510320",
      "region": null
    },
    {
      "nombre": "PANGUIPULLI",
      "codigo": "10511322",
      "region": null
    },
    {
      "nombre": "PAPUDO",
      "codigo": "05403078",
      "region": null
    },
    {
      "nombre": "PARRAL",
      "codigo": "07404169",
      "region": null
    },
    {
      "nombre": "PETORCA",
      "codigo": "05404080",
      "region": null
    },
    {
      "nombre": "PICHIDANGUI ",
      "codigo": "04203039",
      "region": null
    },
    {
      "nombre": "PITRUFQUEN",
      "codigo": "09114280",
      "region": null
    },
    {
      "nombre": "PORTAL DEL INCA",
      "codigo": "03202023",
      "region": null
    },
    {
      "nombre": "POZO ALMONTE",
      "codigo": "01106005",
      "region": null
    },
    {
      "nombre": "PUCHUNCAVI",
      "codigo": "05105083",
      "region": null
    },
    {
      "nombre": "PUCON",
      "codigo": "09115281",
      "region": null
    },
    {
      "nombre": "PUERTO MONTT",
      "codigo": "10101323",
      "region": null
    },
    {
      "nombre": "PUERTO VARAS",
      "codigo": "10109328",
      "region": null
    },
    {
      "nombre": "PULLALLI",
      "codigo": "05403079",
      "region": null
    },
    {
      "nombre": "PUNTA ARENAS",
      "codigo": "12101353",
      "region": null
    },
    {
      "nombre": "PUREN",
      "codigo": "09208282",
      "region": null
    },
    {
      "nombre": "PURRANQUE",
      "codigo": "10303330",
      "region": null
    },
    {
      "nombre": "QUILLOTA",
      "codigo": "05501085",
      "region": null
    },
    {
      "nombre": "QUILPUE",
      "codigo": "05106087",
      "region": null
    },
    {
      "nombre": "QUINTERO",
      "codigo": "05107088",
      "region": null
    },
    {
      "nombre": "RANCAGUA",
      "codigo": "06101140",
      "region": null
    },
    {
      "nombre": "RENAICO",
      "codigo": "09209283",
      "region": null
    },
    {
      "nombre": "RENGO",
      "codigo": "06115141",
      "region": null
    },
    {
      "nombre": "RETIRO",
      "codigo": "07405175",
      "region": null
    },
    {
      "nombre": "RIO BUENO",
      "codigo": "10512336",
      "region": null
    },
    {
      "nombre": "SALAMANCA",
      "codigo": "04204046",
      "region": null
    },
    {
      "nombre": "SAN ANTONIO",
      "codigo": "05601090",
      "region": null
    },
    {
      "nombre": "SAN BERNARDO",
      "codigo": "13401412",
      "region": null
    },
    {
      "nombre": "SAN CARLOS",
      "codigo": "08416231",
      "region": null
    },
    {
      "nombre": "SAN FELIPE",
      "codigo": "05701093",
      "region": null
    },
    {
      "nombre": "SAN FERNANDO",
      "codigo": "06301145",
      "region": null
    },
    {
      "nombre": "SAN JAVIER",
      "codigo": "07406182",
      "region": null
    },
    {
      "nombre": "SAN JOSE DE LA",
      "codigo": "10509316",
      "region": null
    },
    {
      "nombre": "SAN PEDRO",
      "codigo": "05501086",
      "region": null
    },
    {
      "nombre": "SAN PEDRO DE ATACAMA",
      "codigo": "02104016",
      "region": null
    },
    {
      "nombre": "SIERRA GORDA",
      "codigo": "02103425",
      "region": null
    },
    {
      "nombre": "TALCA",
      "codigo": "07101184",
      "region": null
    },
    {
      "nombre": "TALCAHUANO",
      "codigo": "08110241",
      "region": null
    },
    {
      "nombre": "TALTAL",
      "codigo": "02104015",
      "region": null
    },
    {
      "nombre": "TEMUCO",
      "codigo": "09101285",
      "region": null
    },
    {
      "nombre": "TILTIL",
      "codigo": "13303423",
      "region": null
    },
    {
      "nombre": "TOCOPILLA",
      "codigo": "02301028",
      "region": null
    },
    {
      "nombre": "VALDIVIA",
      "codigo": "10501342",
      "region": null
    },
    {
      "nombre": "VALLENAR",
      "codigo": "03301029",
      "region": null
    },
    {
      "nombre": "VALPARAISO",
      "codigo": "05101098",
      "region": null
    },
    {
      "nombre": "VICTORIA",
      "codigo": "09211290",
      "region": null
    },
    {
      "nombre": "VICUÑA",
      "codigo": "04106047",
      "region": null
    },
    {
      "nombre": "VILLA ALEMANA",
      "codigo": "05108099",
      "region": null
    },
    {
      "nombre": "VILLARRICA",
      "codigo": "09120295",
      "region": null
    },
    {
      "nombre": "VIÑA DEL MAR",
      "codigo": "05108100",
      "region": null
    },
    {
      "nombre": "ZAPALLAR",
      "codigo": "05405102",
      "region": null
    }
  ]

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private mys: MyserviceService,
    private integradorService: IntegradorService,
    private popoverCtrl: PopoverController,
    private renderer: Renderer,



  ) { this.loading = false; }
  // @ViewChild('focusInput', { read: '', static: true }) myInput;
  // @ViewChild('focusInput', { static: true }) myInput: ElementRef
  // myInput = this.renderer.selectRootElement('focusInput');

  ngOnInit() {
    this.mingoDate = moment().format();
    this.maxgoDate = moment().add(1, 'y').format();
    this.minbackDate = moment().format();
    this.maxbackDate = moment().add(1, 'y').format();
    // this.inputFiltrado = this.inputFuente
    this.getCityOrigin()
    this.goDate = moment().format();
  }

  getCityOrigin() {
    this.loading = true;
    this.integradorService.getCityOrigin().subscribe(data => {
      this.loading = false;
      this.allOrigin = data
      this.inputFuente = data
      this.inputFiltrado = data
    })
  }

  getCityDestination(value: string) {
    this.loading = true;
    this.integradorService.getCityDestination(value).subscribe(data => {
      this.loading = false;
      this.allDestiny = data
      this.inputFuente = data
      this.inputFiltrado = data
    })
  }

  changeOrigin(value: string) {
    this.allDestiny = [];
    this.getCityDestination(value);
    this.selectDestiny = null;
  }


  checkChangeGoOnly() {
    this.goOnly ? this.goBack = false : this.goBack = true;
  }

  checkChangeGoBack() {
    this.goBack ? this.goOnly = false : this.goOnly = true;
  }

  // dateChangeGo() { }

  // dateChangeBack() { }

  noBack() { this.backDate = null; }



  btnSearch() {

    // PREPARO VARIABLES para guardarlas en el service
    let item;
    this.ticket = {};
    this.ticket['origin'] = this.myOrigin;
    this.ticket['destiny'] = this.myDestiny;

    // guardo el tipo de viaje
    if (this.backDate) {
      this.ticket['tripType'] = 'goBack'
      this.ticket['goDate'] = this.goDate;
      this.ticket['backDate'] = this.backDate;
    } else {
      this.ticket['tripType'] = 'goOnly';
      this.ticket['goDate'] = this.goDate;
    }

    // iniciando la compra
    this.mys.way = 'go';

    // Verifico datos requeridos y redirijo a "pasaje ida"
    if (!this.myOrigin) {
      this.mys.alertShow('Verifique', 'alert', 'Seleccione un origen<br> Intente nuevamente..');
    } else if (!this.myDestiny) {
      this.mys.alertShow('Verifique', 'alert', 'Seleccione un destino<br> Intente nuevamente..');
    } else if (!this.goDate) {
      this.mys.alertShow('Verifique', 'alert', 'Seleccione una Fecha de Ida<br> Intente nuevamente..');
    } else if (this.backDate && (moment(this.backDate).isSameOrBefore(moment(this.goDate)))) {
      this.mys.alertShow('Verifique', 'alert', 'Fecha de ida debe ser <br> antes que <br>fecha de regreso<br> Intente nuevamente..');
    } else {

      this.mys.ticket = this.ticket;
      console.log('this.mys.ticket(saliendo de buy-yout-ticket)', this.mys.ticket);
      this.router.navigateByUrl('/ticket');
    }

  }


  teclaInput($event) {
    console.log('presionada tecla', $event.target.value);

    if ($event.target.value.length === 0) {
      this.inputFiltrado = this.inputFuente
    } else {

      let filtradox = []
      let minuscula1 = $event.target.value.toLowerCase().trim()
      this.inputFuente.forEach(element => {
        let minuscula2 = element.nombre.toLowerCase().trim()
        minuscula2.includes(minuscula1) ? filtradox.push(element) : null
      });
      this.inputFiltrado = filtradox
    }

  }

  btnSelecccionarOrigen() {
    this.inputFuente = this.allOrigin;
    this.inputFiltrado = this.allOrigin
    this.mySelection = 'origin';
    this.showSelection = true;
    // setTimeout(() => {
    //   this.myInput.nativeElement.focus()
    // },150); //a least 150ms.   
    // setTimeout(() => this.myInput.nativeElement.focus(), 15000); 
  }

  btnSelecccionarDestino() {
    this.showSelection = true;
    this.mySelection = 'destiny';
    // this.myDestiny = item;

    // setTimeout(() => {
    //   this.myInput.nativeElement.focus()
    // },150); //a least 150ms.
    // setTimeout(() => this.myInput.nativeElement.focus(), 15000); 
  }

  seleccion(item) {
    if (this.mySelection === 'origin') {
      this.showSelection = false;
      this.mySelection = '';
      this.myOrigin = item;
      this.getCityDestination(item.codigo);
    } else {
      this.showSelection = false;
      this.mySelection = '';
      this.myDestiny = item;
    }
  }

  atras() {
    this.showSelection = false
    this.mySelection = '';
    this.router.navigateByUrl('/home')

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