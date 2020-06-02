import { Component, OnInit } from '@angular/core';
import { MyserviceService } from 'src/app/service/myservice.service';
import { timingSafeEqual } from 'crypto';
import { IntegradorService } from 'src/app/service/integrador.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.page.html',
  styleUrls: ['./recover-password.page.scss'],
})
export class RecoverPasswordPage implements OnInit {

  myData = {
    email: "",
  };
  loading = false;
  constructor(
    private mys: MyserviceService,
    private integrador: IntegradorService,
    private router: Router,


  ) { }

  ngOnInit() {
  }
  validar() { }

  enviar() {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.myData.email)) {

      this.loading = true;
      this.integrador.usuarioRecuperarPassword(this.myData).subscribe((data: any) => {
        this.loading = false;
        if (data.exito) {
          this.mys.alertShow('Éxito !!', 'checkmark-circle', data.mensaje);
          this.router.navigateByUrl('/login');
        } else {
          this.mys.alertShow('Verifique !!', 'alert', data.mensaje);
          this.myData.email = '';
        }
      });

    } else {
      this.mys.alertShow('Verifique!!', 'alert', 'Verifique que el email sea v�lido.. <br>Intente de nuevo..');
    }
  }

}
