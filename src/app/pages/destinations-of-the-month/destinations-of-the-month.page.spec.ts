import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DestinationsOfTheMonthPage } from './destinations-of-the-month.page';

describe('DestinationsOfTheMonthPage', () => {
  let component: DestinationsOfTheMonthPage;
  let fixture: ComponentFixture<DestinationsOfTheMonthPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestinationsOfTheMonthPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DestinationsOfTheMonthPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
