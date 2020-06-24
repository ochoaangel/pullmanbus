import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AgreementsPage } from './agreements.page';

describe('AgreementsPage', () => {
  let component: AgreementsPage;
  let fixture: ComponentFixture<AgreementsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgreementsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AgreementsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
