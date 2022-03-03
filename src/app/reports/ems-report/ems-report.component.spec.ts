import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmsReportComponent } from './ems-report.component';

describe('EmsReportComponent', () => {
  let component: EmsReportComponent;
  let fixture: ComponentFixture<EmsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
