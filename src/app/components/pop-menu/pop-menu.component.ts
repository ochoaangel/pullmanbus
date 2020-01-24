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
    { titulo: 'Home', url: '/home' },
    { titulo: 'Comprar Ticket', url: '/buy-your-ticket' },
    { titulo: 'Términos y condiciones', url: '/terms-conditions' },
  ]

  ngOnInit() { }

  onClick(destino: string) { this.popoverCtrl.dismiss({ destino }) }

}
