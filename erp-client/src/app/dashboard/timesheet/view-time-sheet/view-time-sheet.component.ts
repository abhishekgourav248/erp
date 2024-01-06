import { Component, OnInit } from '@angular/core';
import { env } from '../../../../env';
import axios from 'axios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-time-sheet',
  templateUrl: './view-time-sheet.component.html',
  styleUrl: './view-time-sheet.component.css'
})
export class ViewTimeSheetComponent implements OnInit {
  private payload : any  = {};
  baseURL : string       = "";
  token : string | null  = "";
  userId : string | null = "";
  timesheets : any = []
  noRecords : boolean = false;
  constructor(private router : Router) {
    this.baseURL = env.apiURL;
    this.token   = localStorage.getItem('token');
    this.userId  = localStorage.getItem('user_id');
    this.payload = {
      params : {
        user_id : this.userId
      },
      headers : {
        Authorization : `Bearer ${this.token}`
      }
    }
  }

  ngOnInit(): void {
    axios.get(`${this.baseURL}/get_user_timesheets`,this.payload).then((response) => {
      this.timesheets = response.data.data;
      this.noRecords = (this.timesheets.length > 0) ? false : true;
    }).catch( (error)=> {
      console.error(error);
    })
  }

  handleEdit(id : any) : void {
    this.router.navigate(['./dashboard/timesheet/create'],{queryParams :{id : id}});
  }
  handleSendMail(id : any) : void {
    this.router.navigate(['./dashboard/timesheet/mail_timesheet',id]);
  }
  handleDelete(id : any) : void {

  }
}
