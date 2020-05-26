import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TicketChangePage } from './ticket-change.page';

describe('TicketChangePage', () => {
  let component: TicketChangePage;
  let fixture: ComponentFixture<TicketChangePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketChangePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketChangePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
