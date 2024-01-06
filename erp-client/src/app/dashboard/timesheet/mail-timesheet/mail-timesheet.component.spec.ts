import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailTimesheetComponent } from './mail-timesheet.component';

describe('MailTimesheetComponent', () => {
  let component: MailTimesheetComponent;
  let fixture: ComponentFixture<MailTimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MailTimesheetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MailTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
