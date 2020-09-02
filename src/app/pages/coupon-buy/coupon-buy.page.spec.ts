import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CouponBuyPage } from './coupon-buy.page';

describe('CouponBuyPage', () => {
  let component: CouponBuyPage;
  let fixture: ComponentFixture<CouponBuyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponBuyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CouponBuyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
