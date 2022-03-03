import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllIncidentReportComponent } from './all-incident-report.component';

describe('AllIncidentReportComponent', () => {
  let component: AllIncidentReportComponent;
  let fixture: ComponentFixture<AllIncidentReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllIncidentReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllIncidentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
