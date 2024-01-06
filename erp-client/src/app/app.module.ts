import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import { AttendanceComponent } from './dashboard/attendance/attendance.component';
import { ViewAttendanceComponent } from './dashboard/attendance/view-attendance/view-attendance.component';
import { TimesheetComponent } from './dashboard/timesheet/timesheet.component';
import { ViewTimeSheetComponent } from './dashboard/timesheet/view-time-sheet/view-time-sheet.component';
import { CreateTimeSheetComponent } from './dashboard/timesheet/create-time-sheet/create-time-sheet.component';
import { NoRecordComponent } from './no-record/no-record.component';
import { MailTimesheetComponent } from './dashboard/timesheet/mail-timesheet/mail-timesheet.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    AttendanceComponent,
    ViewAttendanceComponent,
    TimesheetComponent,
    ViewTimeSheetComponent,
    CreateTimeSheetComponent,
    NoRecordComponent,
    MailTimesheetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
