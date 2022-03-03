import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentDetailsFormComponent } from './incident-details-form.component';

describe('IncidentDetailsFormComponent', () => {
  let component: IncidentDetailsFormComponent;
  let fixture: ComponentFixture<IncidentDetailsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentDetailsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
