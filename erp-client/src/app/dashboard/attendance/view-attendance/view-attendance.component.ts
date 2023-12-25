import { Component, OnInit } from '@angular/core';
import { env } from '../../../../env';
import axios from 'axios';

@Component({
  selector: 'app-view-attendance',
  templateUrl: './view-attendance.component.html',
  styleUrl: './view-attendance.component.css'
})
export class ViewAttendanceComponent implements OnInit{
  attendence : any = []
  baseURL : string;
  userId : any;
  token : any;
  noData : boolean = false ;
  constructor(){
    this.baseURL = env.apiURL;
    this.token = localStorage.getItem('token');
    this.userId = localStorage.getItem('user_id');
  }

  ngOnInit(): void {
    axios.get(`${this.baseURL}/get_user_attendance_list`).then( (response)=> {
      if(response.data.status) {
        this.attendence = response.data.data;
      }else{
        this.attendence = [];
        this.noData = true;
      }
    }).catch( (error)=> {
      console.log(error);
      this.noData = true;
    })
  }



}
