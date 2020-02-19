import { Component } from '@angular/core';
import { MyserviceService } from '../service/myservice.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  options = { initialSlide: 0, slidesPerView: 1, autoplay: true, speed: 4000 };

  constructor(
    private mys: MyserviceService,
    public alertController: AlertController
  ) { }

}
