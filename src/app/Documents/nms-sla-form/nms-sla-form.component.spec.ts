import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NMSSLAFormComponent } from './nms-sla-form.component';

describe('NMSSLAFormComponent', () => {
  let component: NMSSLAFormComponent;
  let fixture: ComponentFixture<NMSSLAFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NMSSLAFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NMSSLAFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
