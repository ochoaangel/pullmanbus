import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TicketManagementPage } from './ticket-management.page';

describe('TicketManagementPage', () => {
  let component: TicketManagementPage;
  let fixture: ComponentFixture<TicketManagementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketManagementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
