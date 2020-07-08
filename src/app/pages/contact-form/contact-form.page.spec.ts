import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContactFormPage } from './contact-form.page';

describe('ContactFormPage', () => {
  let component: ContactFormPage;
  let fixture: ComponentFixture<ContactFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
