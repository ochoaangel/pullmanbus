import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-buy-your-ticket',
  templateUrl: './buy-your-ticket.page.html',
  styleUrls: ['./buy-your-ticket.page.scss'],
})
export class BuyYourTicketPage implements OnInit {


  select1show = true;
  @ViewChild('select1div', { static: false }) select1div: ElementRef;




  constructor(private renderer: Renderer2) {



    this.renderer.listen('window', 'click', (e: Event) => {
      if ((this.select1show && e.target !== this.select1div.nativeElement)) {
        this.select1cerrar();
      }
    });




  }

  ngOnInit() {
  }


  select1() {
    console.log('origen');
    this.select1show = !this.select1show;
  }


  select1cerrar() {
    // console.log('fwfwefwgshrrdhrthrthrthtrh');
    this.select1show = !this.select1show;
  }


}
