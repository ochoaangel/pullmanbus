import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AgenciesPage } from './agencies.page';

describe('AgenciesPage', () => {
  let component: AgenciesPage;
  let fixture: ComponentFixture<AgenciesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgenciesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AgenciesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
