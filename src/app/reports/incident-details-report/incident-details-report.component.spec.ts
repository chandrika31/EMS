import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentDetailsReportComponent } from './incident-details-report.component';

describe('IncidentDetailsReportComponent', () => {
  let component: IncidentDetailsReportComponent;
  let fixture: ComponentFixture<IncidentDetailsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentDetailsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentDetailsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
