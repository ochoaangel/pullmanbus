import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CouponResultPage } from './coupon-result.page';

describe('CouponResultPage', () => {
  let component: CouponResultPage;
  let fixture: ComponentFixture<CouponResultPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponResultPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CouponResultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
