import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopLiveDetailsComponent } from './shop-live-details.component';

describe('ShopLiveDetailsComponent', () => {
  let component: ShopLiveDetailsComponent;
  let fixture: ComponentFixture<ShopLiveDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopLiveDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopLiveDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
