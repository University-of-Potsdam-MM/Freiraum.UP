import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MensaPageComponent } from './mensa-page.component';

describe('MensaPageComponent', () => {
  let component: MensaPageComponent;
  let fixture: ComponentFixture<MensaPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensaPageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MensaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
