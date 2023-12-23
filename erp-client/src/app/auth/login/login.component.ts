import { Component } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { env } from '../../../env';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    //Declarations
    payload:any;
    baseURL : string;
    data:any;
    //Initializations
    constructor (private router : Router) {
      this.payload= {user_id : "", password : ""};
      this.baseURL = env.apiURL;
    }
    handleChange(event:Event) {
      let data  = {[(event.target as HTMLInputElement).name] : (event.target as HTMLInputElement).value}
      this.payload = {...this.payload , ...data};
    }
    handleSubmit() {
      axios.post(`${this.baseURL}/login`,this.payload)
        .then( (response) => {
            const data = response.data;
            if(data.status) {
              localStorage.setItem('user_id' , data.data.user_id);
              localStorage.setItem('token' , data.data._token);
              // this.router.navigate(['dashboard']);
            }else {
              alert(data.error);
            }
        }).catch((error) => {
          console.log(error);
        })
    }
}
