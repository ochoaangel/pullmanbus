import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PullmanPassPage } from './pullman-pass.page';

describe('PullmanPassPage', () => {
  let component: PullmanPassPage;
  let fixture: ComponentFixture<PullmanPassPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PullmanPassPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PullmanPassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
