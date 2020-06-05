import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CampusMapPageComponent } from './campus-map-page.component';

describe('CampusMapPageComponent', () => {
  let component: CampusMapPageComponent;
  let fixture: ComponentFixture<CampusMapPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampusMapPageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CampusMapPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
