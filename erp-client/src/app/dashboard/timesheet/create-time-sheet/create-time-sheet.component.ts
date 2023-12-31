import { Component } from '@angular/core';
import { env } from '../../../../env';
import axios from 'axios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-time-sheet',
  templateUrl: './create-time-sheet.component.html',
  styleUrl: './create-time-sheet.component.css'
})
export class CreateTimeSheetComponent {
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
  constructor(private router : Router) {
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
    this.payload.task = this.payload.task.replace(/\n/g,'<br />')
    this.payload = {...this.payload , user_id : this.userId};
    axios.post(`${this.baseURL}/upsert_timesheet` , this.payload,
      {
        headers : {
          Authorization : `Bearer ${this.token}`
        }
      }
    ).then( (response)=> {
      alert("Timesheet updated successfully.");
      this.router.navigate(['./dashboard/timesheet']);
    }).catch(error => {
      alert('failed to creat or update time sheet')
    })
  }
}
