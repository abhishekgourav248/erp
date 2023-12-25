import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { env } from '../../env';
import { Router } from '@angular/router';
import { UserdataService } from '../services/userdata.service';

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
  userId:string | null;
  token:string | null;
  data : any;
  //Initializations
  constructor (private router : Router , private userService : UserdataService) {
    this.payload= {};
    this.baseURL = env.apiURL;
    this.userId = localStorage.getItem('user_id');
    this.token = localStorage.getItem('token');
    if(this.userId == null || this.token == null) {
      //redirect to login page with query params error 401 unauthenticated...
    }
  }
  ngOnInit(): void {
    this.userService.setUserData().subscribe(data => {
      this.data = data;
    })
  }
}
