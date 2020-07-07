import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CurrentAccountPage } from './current-account.page';

describe('CurrentAccountPage', () => {
  let component: CurrentAccountPage;
  let fixture: ComponentFixture<CurrentAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentAccountPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CurrentAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
