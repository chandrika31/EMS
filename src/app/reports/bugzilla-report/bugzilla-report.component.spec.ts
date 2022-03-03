import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BugzillaReportComponent } from './bugzilla-report.component';

describe('BugzillaReportComponent', () => {
  let component: BugzillaReportComponent;
  let fixture: ComponentFixture<BugzillaReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BugzillaReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BugzillaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
