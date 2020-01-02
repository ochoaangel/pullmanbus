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


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: '¡Felicidades!',
      message: 'Message <strong>text</strong>!!!',
      cssClass: "alert1",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'sc1',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }
 
}
