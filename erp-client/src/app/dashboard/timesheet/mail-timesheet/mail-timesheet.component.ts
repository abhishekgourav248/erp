import { Component, OnInit } from '@angular/core';
import { env } from '../../../../env';
import axios from 'axios';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mail-timesheet',
  templateUrl: './mail-timesheet.component.html',
  styleUrl: './mail-timesheet.component.css'
})
export class MailTimesheetComponent implements OnInit{
  payload : any = {to : [] , cc : [] ,subject : ""};
  user_list : any = [];
  send_to : any = [];
  cc_to : any = [];
  user_id : string | null ;
  token : string | null ;
  baseURL : string | null ;
  timesheet_id :any ;
  timesheet : any ;
  constructor(private route : ActivatedRoute , private router : Router) {
    this.user_id = localStorage.getItem('user_id');
    this.token = localStorage.getItem("token");
    this.baseURL = env.apiURL;

  }

  ngOnInit(): void {
    this.route.params.subscribe((params)=>{
      this.timesheet_id = params['id'];
    }) 
    if (this.timesheet_id) {
      this.getTimesheetData();
      this.payload = {timesheet_id : this.timesheet_id};
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
        // this.timesheet.task = this.timesheet.task.replace(/<br \/>/g , '\n');
      }
    }).catch (error => {

    })
  }
  handleSendToPayload(value :string): void {
    // You can use the payload as needed, for example, send it to a service or another component.
    const datalist = document.getElementById('send-to-list');
    if(datalist){
      const options =Array.from(datalist.getElementsByTagName('option'));
      for (const option of options) {
        if (option.value === value) {
          this.send_to = [...this.send_to, {user_id : value, name: option.textContent}];
        }
      }
      while (datalist.firstChild) {
        datalist.removeChild(datalist.firstChild);
      }
    }
    this.user_list = [];
    let sendToField = document.getElementById('send-to-field') as HTMLInputElement;
    if(sendToField){
      sendToField.value = "";
    }
    console.log(this.send_to);
    this.payload.to = [...this.send_to];
  }

  handleCCPayload(value :string): void {
    console.log(value);
    
    // You can use the payload as needed, for example, send it to a service or another component.
    const datalist = document.getElementById('cc-to-list');
    if(datalist){
      const options =Array.from(datalist.getElementsByTagName('option'));
      for (const option of options) {
        if (option.value === value) {
          this.cc_to = [...this.cc_to, {user_id : value, name: option.textContent}];
        }
      }
      while (datalist.firstChild) {
        datalist.removeChild(datalist.firstChild);
      }
    }
    console.log(this.cc_to);
    
    this.user_list = [];
    let ccToField = document.getElementById('cc-to-field') as HTMLInputElement;
    if(ccToField){
      ccToField.value = "";
    }
    this.payload.cc = [...this.cc_to];
  }

  onInput(event : Event) : void {
    let eventObj = (event.target as HTMLInputElement);
    let searchPayload = {
      params : {
        search_text : eventObj.value
      },
      headers : {
        Authorization : `Bearer ${this.token}`
      }
    }
    axios.get(`${this.baseURL}/get_users`,searchPayload).then((response)=>{
      this.user_list = response.data.data;
    }).catch((error)=> {
      console.log(error);
      this.user_list = [];
    })
  }
  removeUserFromSendTo(user_id:string) : void{
    const indexToRemove = this.send_to.findIndex((data: any) => data.user_id === user_id);  
    if (indexToRemove !== -1) {
      // Use spread operator to create a new array without the item to remove
      this.send_to = [
        ...this.send_to.slice(0, indexToRemove),
        ...this.send_to.slice(indexToRemove + 1)
      ];
    }
    this.payload.to = [...this.send_to];
  }
  removeUserFromCcTo(user_id:string) : void{
    const indexToRemove = this.cc_to.findIndex((data: any) => data.user_id === user_id);  
    if (indexToRemove !== -1) {
      // Use spread operator to create a new array without the item to remove
      this.cc_to = [
        ...this.cc_to.slice(0, indexToRemove),
        ...this.cc_to.slice(indexToRemove + 1)
      ];
    }
    this.payload.cc = [...this.cc_to];
  }

  handlePayload(event : Event) : void {
    let eventObj = (event.target as HTMLInputElement);
    this.payload = {...this.payload , [eventObj.name] : eventObj.value};
  }
  handleSendMail() : void { 
    if(this.send_to.length == 0 || !this.payload.subject ) {
      alert("One or more field empty");
      return;
    }
    this.payload = {...this.payload,
      to : this.send_to,
      cc : this.cc_to,
      user_id : this.user_id
    }

    console.log(this.payload);
    
    axios.post(`${this.baseURL}/send_timesheet_mail`,this.payload,{
      headers :{
        Authorization : `Bearer ${this.token}`
      }
    }).then((res) => {
      this.router.navigate(['./dashboard/timesheet']);
    }).catch((error) => {
      alert("Failed to send email.");
    })
  }
}
