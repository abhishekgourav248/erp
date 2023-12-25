import { Component, OnInit} from '@angular/core';
import { UserdataService } from '../../services/userdata.service';
import { DashboardComponent } from '../dashboard.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})
export class AttendanceComponent implements OnInit{
  user:any ={};
  attendanceList : any = {};
  toggleTab:number = 1;
  constructor ( private userService : UserdataService , private dashboardComponent: DashboardComponent) {
  }
  
  ngOnInit() {
    this.userService.fetchDataIfNeeded().subscribe((data) => {
      this.user = data;
    })


  }

  handleToggleCheckIn() {
    let checkInValue = ((this.user.is_checked_in) % 2 ) + 1;
    let payload = {...this.user};
    payload.is_checked_in = checkInValue;
    this.userService.updateUserData(payload).subscribe( (data) => {
      if(data instanceof Error){
        alert("Failed to Check In");
      }else {
        this.user=data;
      }
    })
  }


  loadAttendance() {

  }
  handleToggleTab(event:Event , value:number) {
    
  }
}
