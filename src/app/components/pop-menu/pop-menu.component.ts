import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-pop-menu',
  templateUrl: './pop-menu.component.html',
  styleUrls: ['./pop-menu.component.scss'],
})
export class PopMenuComponent implements OnInit {

  constructor(private popoverCtrl: PopoverController) { }

  opciones = [
    { titulo: 'Home', url: '/home', icon: 'pin' },
    { titulo: 'Comprar ticket', url: '/buy-your-ticket', icon: 'md-bus' },
    // { titulo: 'Panel de Usuario', url: '/user-panel', icon: 'apps' },
    { titulo: 'Login', url: '/login', icon: 'person' },
    { titulo: 'Contacto', url: '/contact', icon: 'md-call' },
    { titulo: 'Términos y condiciones', url: '/terms-conditions', icon: 'md-information-circle' },
  ]

  ngOnInit() { }

  onClick(destino: string) { this.popoverCtrl.dismiss({ destino }) }

}
