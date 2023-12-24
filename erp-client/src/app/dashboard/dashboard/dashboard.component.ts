import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { env } from '../../../env';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  //Declarations
  userDetails : any ;
  payload:any;
  baseURL : string;
  data:any;
  userId:string | null;
  token:string | null;
  //Initializations
  constructor (private router : Router) {
    this.payload= {};
    this.baseURL = env.apiURL;
    this.userId = localStorage.getItem('user_id');
    this.token = localStorage.getItem('token');
  }
  ngOnInit(): void {
    if(this.userId == null || this.token == null) {
      //redirect to login page with query params error 401 unauthenticated...
    }
    axios.get(`${this.baseURL}/get_user_details`,{
      params : {
        user_id : this.userId
      },
      headers: {
        Authorization : `Bearer ${this.token}`
      }
    }).then((res) => {
      
    }).catch((err) => {
      console.error(err)
    })
  }
}
