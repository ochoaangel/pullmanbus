import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyserviceService } from 'src/app/service/myservice.service';
import { HttpClient } from '@angular/common/http';
import { IntegradorService } from 'src/app/service/integrador.service';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.page.html',
  styleUrls: ['./payment-methods.page.scss'],
})
export class PaymentMethodsPage implements OnInit {

  constructor(private router: Router, 
    private integradorService:IntegradorService,
    private mys: MyserviceService) { }
  total
  convenioUp = { checked0: false, checked1: false, checked2: false, checked3: false, checked4: false, checked5: false }
  convenioDown = { checked0: false, checked1: false }
  acuerdo = { acuerdo: false }

  DatosFormulario = {
    convenioUp: null,
    convenioDown: null,
    acuerdo: null,
    rut: null,
    v_rut: false,
    codigo: null,
    v_codigo: false,
    telefono: null,
    v_telefono: false,
    email: null,
    v_email: false,
    email2: null,
    v_email2: false,
    validandoConRut: false
  }
  guardarTransaccion = {
    email:"",
    rut:"1-9",
    medioDePago:"WBPAY",
    puntoVenta:"WEBM",
    montoTotal:0,
    idSistema:5,
    listaCarrito:[{
       servicio:"UZVA",
       fechaServicio:"15/10/2020",
       fechaPasada:"15/10/2020",
       fechaLlegada:"15/10/2020",
       horaSalida:"15:20",
       horaLlegada:"15:20",
       asiento:8,
       origen:"KA",
       destino:"MB",
       monto:6120,
       precio:6120,
       descuento:0,
       empresa:"03",
       clase:"EJE42",
       convenio:"",
       datoConvenio:"",
       bus:"0",
       piso:1,
       integrador:1001
    }]
  }

  tlf = [
    { pais: 'Abjaia', codigo: '+7' },
    { pais: 'Afganistán', codigo: '+93' },
    { pais: 'Albania', codigo: '+355' },
    { pais: 'Alemania', codigo: '+49' },
    { pais: 'Andorra', codigo: '+376' },
    { pais: 'Angola', codigo: '+244' },
    { pais: 'Anguilla', codigo: '+1264' },
    { pais: 'Antigua y Barbuda', codigo: '+1268' },
    { pais: 'Antillas Holandesas', codigo: '+599' },
    { pais: 'Arabia Saudita', codigo: '+966' },
    { pais: 'Argelia', codigo: '+213' },
    { pais: 'Argentina', codigo: '+54' },
    { pais: 'Armenia', codigo: '+374' },
    { pais: 'Aruba', codigo: '+297' },
    { pais: 'Australia', codigo: '+61' },
    { pais: 'Austria', codigo: '+43' },
    { pais: 'Azerbaiyán', codigo: '+994' },
    { pais: 'Bahamas', codigo: '+1242' },
    { pais: 'Bahrein', codigo: '+973' },
    { pais: 'Bangladesh', codigo: '+880' },
    { pais: 'Barbados', codigo: '+1246' },
    { pais: 'Belice', codigo: '+501' },
    { pais: 'Benin', codigo: '+229' },
    { pais: 'Bermudas', codigo: '+1441' },
    { pais: 'Bielorrusia', codigo: '+375' },
    { pais: 'Bolivia', codigo: '+591' },
    { pais: 'Bonaire', codigo: '+599' },
    { pais: 'Bosnia-Herzegovina', codigo: '+387' },
    { pais: 'Botswana', codigo: '+267' },
    { pais: 'Brasil', codigo: '+55' },
    { pais: 'Brunei Darussalam', codigo: '+673' },
    { pais: 'Bulgaria', codigo: '+359' },
    { pais: 'Burkina Faso', codigo: '+226' },
    { pais: 'Burundi', codigo: '+257' },
    { pais: 'Bután', codigo: '+975' },
    { pais: 'Bélgica', codigo: '+32' },
    { pais: 'Cabo Verde', codigo: '+238' },
    { pais: 'Camboya', codigo: '+855' },
    { pais: 'Camerún', codigo: '+237' },
    { pais: 'Canadá', codigo: '+1' },
    { pais: 'Chad', codigo: '+235' },
    { pais: 'Chile', codigo: '+56' },
    { pais: 'China', codigo: '+86' },
    { pais: 'Chipre', codigo: '+357' },
    { pais: 'Colombia', codigo: '+57' },
    { pais: 'Comores', codigo: '+269' },
    { pais: 'Congo', codigo: '+242' },
    { pais: 'Congo RD', codigo: '+243' },
    { pais: 'Corea del Norte', codigo: '+850' },
    { pais: 'Corea del Sur', codigo: '+82' },
    { pais: 'Costa de Marfil', codigo: '+225' },
    { pais: 'Costa Rica', codigo: '+506' },
    { pais: 'Croacia', codigo: '+385' },
    { pais: 'Cuba', codigo: '+53' },
    { pais: 'Curacao', codigo: '+599' },
    { pais: 'Dinamarca', codigo: '+45' },
    { pais: 'Dominica', codigo: '+1767' },
    { pais: 'Dominicana, República', codigo: '+1' },
    { pais: 'Ecuador', codigo: '+593' },
    { pais: 'Egipto', codigo: '+20' },
    { pais: 'El Salvador', codigo: '+503' },
    { pais: 'Emiratos Árabes Unidos', codigo: '+971' },
    { pais: 'Eritrea', codigo: '+291' },
    { pais: 'Eslovaquia', codigo: '+421' },
    { pais: 'Eslovenia', codigo: '+386' },
    { pais: 'España', codigo: '+34' },
    { pais: 'Estados Unidos', codigo: '+1' },
    { pais: 'Estonia', codigo: '+372' },
    { pais: 'Etiopía', codigo: '+251' },
    { pais: 'Fiji', codigo: '+679' },
    { pais: 'Filipinas', codigo: '+63' },
    { pais: 'Finlandia', codigo: '+358' },
    { pais: 'Francia', codigo: '+33' },
    { pais: 'Gabón', codigo: '+241' },
    { pais: 'Gambia', codigo: '+220' },
    { pais: 'Georgia', codigo: '+995' },
    { pais: 'Ghana', codigo: '+233' },
    { pais: 'Gibraltar', codigo: '+350' },
    { pais: 'Granada', codigo: '+1473' },
    { pais: 'Grecia', codigo: '+30' },
    { pais: 'Groenlandia', codigo: '+299' },
    { pais: 'Guadalupe', codigo: '+590' },
    { pais: 'Guam', codigo: '+1671' },
    { pais: 'Guatemala', codigo: '+502' },
    { pais: 'Guayana francés', codigo: '+594' },
    { pais: 'Guernsey', codigo: '+44' },
    { pais: 'Guinea Bissau', codigo: '+245' },
    { pais: 'Guinea Ecuatorial', codigo: '+240' },
    { pais: 'Guyana', codigo: '+592' },
    { pais: 'Haiti', codigo: '+509' },
    { pais: 'Honduras', codigo: '+504' },
    { pais: 'Hong Kong', codigo: '+852' },
    { pais: 'Hungría', codigo: '+36' },
    { pais: 'India', codigo: '+91' },
    { pais: 'Indonesia', codigo: '+62' },
    { pais: 'Iran', codigo: '+98' },
    { pais: 'Iraq', codigo: '+964' },
    { pais: 'Irlanda', codigo: '+353' },
    { pais: 'Isla Ascensión', codigo: '+247' },
    { pais: 'Isla de Man', codigo: '+44' },
    { pais: 'Isla De Navidad, Isla Christmas', codigo: '+61' },
    { pais: 'Isla de Åland', codigo: '+358' },
    { pais: 'Isla Norfolk', codigo: '+672' },
    { pais: 'Isla periféricas menores de Estados Unidos', codigo: '+699' },
    { pais: 'Islandia', codigo: '+354' },
    { pais: 'Islas Caimán', codigo: '+1345' },
    { pais: 'Islas Cocos', codigo: '+61' },
    { pais: 'Islas Cook', codigo: '+682' },
    { pais: 'Islas Feroe', codigo: '+298' },
    { pais: 'Islas Malvinas', codigo: '+500' },
    { pais: 'Islas Marshall', codigo: '+692' },
    { pais: 'Islas Pitcairn', codigo: '+872' },
    { pais: 'Islas Salomón', codigo: '+677' },
    { pais: 'Islas Turcas y Caicos', codigo: '+1649' },
    { pais: 'Islas Vírgenes Británicas', codigo: '+128' },
    { pais: 'Islas Vírgenes de EE.UU.', codigo: '+134' },
    { pais: 'Israel', codigo: '+972' },
    { pais: 'Italia', codigo: '+39' },
    { pais: 'Jamaica', codigo: '+187' },
    { pais: 'Japón', codigo: '+81' },
    { pais: 'Jersey', codigo: '+44' },
    { pais: 'Jordania', codigo: '+962' },
    { pais: 'Kazajstán', codigo: '+7' },
    { pais: 'Kenia', codigo: '+254' },
    { pais: 'Kirguistán', codigo: '+996' },
    { pais: 'Kiribati', codigo: '+686' },
    { pais: 'Kosovo', codigo: '+377' },
    { pais: 'Kuwait', codigo: '+965' },
    { pais: 'Laos', codigo: '+856' },
    { pais: 'Lesotho', codigo: '+266' },
    { pais: 'Letonia', codigo: '+371' },
    { pais: 'Liberia', codigo: '+231' },
    { pais: 'Libia', codigo: '+218' },
    { pais: 'Liechtenstein', codigo: '+423' },
    { pais: 'Lituania', codigo: '+370' },
    { pais: 'Luxemburgo', codigo: '+352' },
    { pais: 'Líbano', codigo: '+961' },
    { pais: 'Macao', codigo: '+853' },
    { pais: 'Macedonia', codigo: '+389' },
    { pais: 'Madagascar', codigo: '+261' },
    { pais: 'Malasia', codigo: '+60' },
    { pais: 'Malawi', codigo: '+265' },
    { pais: 'Maldivas', codigo: '+960' },
    { pais: 'Malta', codigo: '+356' },
    { pais: 'Malí', codigo: '+223' },
    { pais: 'Marianas del Norte', codigo: '+1670' },
    { pais: 'Marruecos', codigo: '+212' },
    { pais: 'Martinica', codigo: '+596' },
    { pais: 'Mauricio', codigo: '+230' },
    { pais: 'Mauritania', codigo: '+222' },
    { pais: 'Mayotte', codigo: '+262' },
    { pais: 'Micronesia', codigo: '+691' },
    { pais: 'Moldavia', codigo: '+373' },
    { pais: 'Mongolia', codigo: '+976' },
    { pais: 'Montenegro', codigo: '+382' },
    { pais: 'Montserrat', codigo: '+1664' },
    { pais: 'Mozambique', codigo: '+258' },
    { pais: 'Myanmar', codigo: '+95' },
    { pais: 'México', codigo: '+52' },
    { pais: 'Mónaco', codigo: '+377' },
    { pais: 'Namibia', codigo: '+264' },
    { pais: 'Nauru', codigo: '+674' },
    { pais: 'Nepal', codigo: '+977' },
    { pais: 'Nicaragua', codigo: '+505' },
    { pais: 'Nigeria', codigo: '+234' },
    { pais: 'Niue', codigo: '+683' },
    { pais: 'Noruega', codigo: '+47' },
    { pais: 'Nueva Caledonia', codigo: '+687' },
    { pais: 'Nueva Zelanda', codigo: '+64' },
    { pais: 'Níger', codigo: '+227' },
    { pais: 'Omán', codigo: '+968' },
    { pais: 'Pakistán', codigo: '+92' },
    { pais: 'Palau', codigo: '+680' },
    { pais: 'Palestina', codigo: '+970' },
    { pais: 'Panamá', codigo: '+507' },
    { pais: 'Papúa-Nueva Guinea', codigo: '+675' },
    { pais: 'Paraguay', codigo: '+595' },
    { pais: 'Países Bajos, Holanda', codigo: '+31' },
    { pais: 'Perú', codigo: '+51' },
    { pais: 'Polinesia Francesa', codigo: '+689' },
    { pais: 'Polonia', codigo: '+48' },
    { pais: 'Portugal', codigo: '+351' },
    { pais: 'Puerto Rico', codigo: '+1' },
    { pais: 'Qatar', codigo: '+974' },
    { pais: 'Reino Unido', codigo: '+44' },
    { pais: 'República Centroafricana', codigo: '+236' },
    { pais: 'República Checa', codigo: '+420' },
    { pais: 'República Guinea', codigo: '+224' },
    { pais: 'Reunión', codigo: '+262' },
    { pais: 'Ruanda', codigo: '+250' },
    { pais: 'Rumanía', codigo: '+40' },
    { pais: 'Rusia', codigo: '+7' },
    { pais: 'Samoa', codigo: '+685' },
    { pais: 'Samoa Americana', codigo: '+1684' },
    { pais: 'San Cristóbal y Nevis', codigo: '+1869' },
    { pais: 'San Marino', codigo: '+378' },
    { pais: 'San Martin', codigo: '+590' },
    { pais: 'San Pedro y Miquelón', codigo: '+508' },
    { pais: 'San Vincente y Granadinas', codigo: '+1784' },
    { pais: 'Santa Helena', codigo: '+290' },
    { pais: 'Santa Lucía', codigo: '+1758' },
    { pais: 'Santo Tomé y Príncipe', codigo: '+239' },
    { pais: 'Senegal', codigo: '+221' },
    { pais: 'Serbia', codigo: '+381' },
    { pais: 'Seychelles', codigo: '+248' },
    { pais: 'Sierra Leona', codigo: '+232' },
    { pais: 'Singapur', codigo: '+65' },
    { pais: 'Siria', codigo: '+963' },
    { pais: 'Somalilandia', codigo: '+252' },
    { pais: 'Somalía', codigo: '+252' },
    { pais: 'Sri Lanka', codigo: '+94' },
    { pais: 'Sudáfrica', codigo: '+27' },
    { pais: 'Sudán', codigo: '+249' },
    { pais: 'Sudán del Sur', codigo: '+211' },
    { pais: 'Suecia', codigo: '+46' },
    { pais: 'Suiza', codigo: '+41' },
    { pais: 'Surinam', codigo: '+597' },
    { pais: 'Svalbard y Jan Mayen', codigo: '+47' },
    { pais: 'Swazilandia', codigo: '+268' },
    { pais: 'Sáhara Occidental', codigo: '+212' },
    { pais: 'Tadjikistan', codigo: '+992' },
    { pais: 'Tailandia', codigo: '+66' },
    { pais: 'Taiwán', codigo: '+886' },
    { pais: 'Tanzania', codigo: '+255' },
    { pais: 'Territorio Británico del Océano Índico.', codigo: '+246' },
    { pais: 'Territorios Franceses del Sur', codigo: '+262' },
    { pais: 'Timor del Este', codigo: '+670' },
    { pais: 'Togo', codigo: '+228' },
    { pais: 'Tokelau', codigo: '+690' },
    { pais: 'Tonga', codigo: '+676' },
    { pais: 'Trinidad y Tobago', codigo: '+1868' },
    { pais: 'Turkmenistán', codigo: '+993' },
    { pais: 'Turquía', codigo: '+90' },
    { pais: 'Tuvalu', codigo: '+688' },
    { pais: 'Túnez', codigo: '+216' },
    { pais: 'Ucrania', codigo: '+380' },
    { pais: 'Uganda', codigo: '+256' },
    { pais: 'Uruguay', codigo: '+598' },
    { pais: 'Uzbekistán', codigo: '+998' },
    { pais: 'Vanuatu', codigo: '+678' },
    { pais: 'Vaticano', codigo: '+379' },
    { pais: 'Venezuela', codigo: '+58' },
    { pais: 'Vietnam', codigo: '+84' },
    { pais: 'Wallis y Futuna', codigo: '+681' },
    { pais: 'Yemen', codigo: '+967' },
    { pais: 'Yibuti', codigo: '+253' },
    { pais: 'Zambia', codigo: '+260' },
    { pais: 'Zimbábue', codigo: '+263' }
  ]

  ngOnInit() {
    this.total = this.mys.total
  }

  SeleccionadoConvenioUp(name) {
    let valor = this.convenioUp[name]
    this.convenioUp.checked0 = false
    this.convenioUp.checked1 = false
    this.convenioUp.checked2 = false
    this.convenioUp.checked3 = false
    this.convenioUp.checked4 = false
    this.convenioUp.checked5 = false
    this.convenioUp[name] = valor;
    this.DatosFormulario.convenioUp = name
  }

  SeleccionadoConvenioDown(name) {
    let valor = this.convenioDown[name]
    this.convenioDown.checked0 = false
    this.convenioDown.checked1 = false
    this.convenioDown[name] = valor
    this.DatosFormulario.convenioDown = name
  }


  pagar() {

 /*    if (!this.DatosFormulario.convenioUp) {
      this.mys.alertShow('¡Verifique!', 'alert', 'Debe Seleccionar algún convenio para continuar con el pago');
    } else if (!this.DatosFormulario.rut) {
        this.mys.alertShow('¡Verifique!', 'alert', 'Debe ingresar un RUT válido para continuar con el pago');
      // } else if (!this.DatosFormulario.validandoConRut) {
      //   this.mys.alertShow('¡Verifique!', 'alert', 'Debe validar el RUT para continuar con el pago');
    } else if (!this.DatosFormulario.codigo) {
      this.mys.alertShow('¡Verifique!', 'alert', 'Debe ingresar un código de país válido. <br>Ejemplo: +56');
      } else if (!this.DatosFormulario.telefono) {
        this.mys.alertShow('¡Verifique!', 'alert', 'Debe ingresar un número telefonico válido para continuar con el pago');
    } else 
 */ if (!this.DatosFormulario.email) {
       this.mys.alertShow('¡Verifique!', 'alert', 'Debe ingresar un email válido para continuar con el pago');
    } else if (!this.DatosFormulario.email2) {
      this.mys.alertShow('¡Verifique!', 'alert', 'Debe re-ingresar un email válido para continuar con el pago');
    } else if (this.DatosFormulario.email !== this.DatosFormulario.email) {
      this.mys.alertShow('¡Verifique!', 'alert', 'Verifique Los emails no coinciden, para continuar con el pago');
    } else if (!this.DatosFormulario.convenioDown) {
      this.mys.alertShow('¡Verifique!', 'alert', 'Debe seleccionar un método de pago para continuar');
    } else if (!this.DatosFormulario.acuerdo) {
      this.mys.alertShow('¡Verifique!', 'alert', 'Debe aceptar el acuerdo y condiciones de compra para continuar con el pago');
    } else {
      // this.mys.alertShow('¡Verifique!', 'alert', 'Todo correcto');
    this.guardarTransaccion.email = this.DatosFormulario.email;
    this.guardarTransaccion.montoTotal = this.total;

    this.integradorService.guardarTransaccion(this.guardarTransaccion).subscribe(resp=>{
      let valor:any = resp;
      if(valor.exito){
        formularioTBKWS(valor.url,valor.token);  
      }else{
        this.mys.alertShow('¡Verifique!', 'alert', valor.mensaje);
      }
    })
  
      //this.router.navigateByUrl('/transaction-voucher')
    }

    function formularioTBKWS(urltbk,token){
      var f = document.createElement("form");
      f.setAttribute('method',"post");
      f.setAttribute('action',urltbk);
      var i = document.createElement("input");
      i.setAttribute('type',"text");
      i.setAttribute('name',"TBK_TOKEN");
      i.setAttribute("value", token);
      f.appendChild(i.cloneNode());
      f.style.display = "none";
      document.body.appendChild(f);
      f.submit();
      document.body.removeChild(f);
    }
  }

  aceptarAcuerdo() {
    if (this.acuerdo.acuerdo) { this.DatosFormulario.acuerdo = true } else { this.DatosFormulario.acuerdo = false }
  }

  setFocus(siguiente) {
    console.log('siguiente', siguiente);
  }

  tecleado($event){
    console.log('event', $event);
    console.log('this.DatosFormulario',this.DatosFormulario);
    
  }
}
