import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AttendanceComponent } from './dashboard/attendance/attendance.component';
import { TimesheetComponent } from './dashboard/timesheet/timesheet.component';
import { ViewTimeSheetComponent } from './dashboard/timesheet/view-time-sheet/view-time-sheet.component';
import { CreateTimeSheetComponent } from './dashboard/timesheet/create-time-sheet/create-time-sheet.component';

const routes: Routes = [
  {path:"", redirectTo: '/dashboard', pathMatch: 'full' },
  {path:"login",component:LoginComponent},
  {path:"register",component:RegisterComponent},
  {path:"dashboard",component:DashboardComponent,children : [
    {path : "attendance" , component:AttendanceComponent,children:[
    ]},
    {path : "timesheet", component:TimesheetComponent , children : [
      {path : "" , component: ViewTimeSheetComponent },
      {path : "create",component : CreateTimeSheetComponent}
    ]}
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
