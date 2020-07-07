import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SpecialTripPage } from './special-trip.page';

describe('SpecialTripPage', () => {
  let component: SpecialTripPage;
  let fixture: ComponentFixture<SpecialTripPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialTripPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SpecialTripPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
