import { Component, OnInit } from '@angular/core';
import { env } from '../../../../env';
import axios, { Axios } from 'axios';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-time-sheet',
  templateUrl: './create-time-sheet.component.html',
  styleUrl: './create-time-sheet.component.css'
})
export class CreateTimeSheetComponent implements OnInit {
  private payload : any  = {};
  empty_date : number    = 0;
  empty_hours : number   = 0;
  empty_project : number = 0;
  empty_task : number    = 0;
  baseURL : string       = "";
  token : string | null  = "";
  userId : string | null = "";
  minDate : any = "";
  maxDate : any = "";
  timesheet_id : string | null = null;
  timesheet : any ;

  constructor(private router : Router , private route : ActivatedRoute) {
    this.baseURL = env.apiURL;
    this.token = localStorage.getItem('token');
    this.userId = localStorage.getItem('user_id');
    // Get the current date
    const currentDate = new Date();
    // Subtract one day from the current date
    currentDate.setDate(currentDate.getDate() - 1);
    // Format the date as YYYY-MM-DD
    this.minDate = currentDate.toISOString().split('T')[0];
    currentDate.setDate(currentDate.getDate()+1);
    this.maxDate = currentDate.toISOString().split('T')[0];
    this.timesheet = {
      date : "",
      hours : "",
      project : "",
      task : ""
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe( (params)  => {
      this.timesheet_id = params['id'];
    })
    if (this.timesheet_id) {
      this.getTimesheetData();
      this.payload = {_id : this.timesheet_id};
    }
  }

  getTimesheetData() : void {
    let getPayload = {
      params : {
        timesheet_id : this.timesheet_id
      },
      headers : {
        Authorization : `Bearer ${this.token}`
      }
    }

    axios.get(`${this.baseURL}/get_timesheet_details`,getPayload).then(response => {
      if(response.data.data) {
        this.timesheet = response.data.data;
        this.timesheet.task = this.timesheet.task;
      }
    }).catch (error => {

    })
  }

  handleInput(event : Event) {
    let eventObj = (event.target as HTMLInputElement);
    this.payload = {...this.payload , [eventObj.name] : eventObj.value}
    switch(eventObj.name) {
      case "date" :
        if(this.empty_date === 1) {
          this.empty_date = 0;
        };
        break;
      case "hours" :
        if(this.empty_hours === 1) {
          this.empty_hours = 0;
        }
        ;break;
    }
  }

  handleTextArea(event : Event) {
    let eventObj = (event.target as HTMLTextAreaElement);
    this.payload = {...this.payload , [eventObj.name] : eventObj.value}
    if(this.empty_task === 1) {
      this.empty_task = 0;
    }
  }
  handleSelect(event :Event) {
    let eventObj = (event.target as HTMLSelectElement) ;
    this.payload = {...this.payload , [eventObj.name] : eventObj.value}
    if(this.empty_project === 1) {
      this.empty_hours = 0;
    }
  }

  handleSave() {
    this.payload.task = this.payload.task;
    this.payload = {...this.payload , user_id : this.userId};
    axios.post(`${this.baseURL}/upsert_timesheet` , this.payload,
      {
        headers : {
          Authorization : `Bearer ${this.token}`
        }
      }
    ).then( (response)=> {
      alert("Timesheet updated successfully.");
      this.goBack();
    }).catch(error => {
      alert('failed to creat or update time sheet')
    })
  }

  goBack() {
    this.router.navigate(['./dashboard/timesheet'])
  }
}
