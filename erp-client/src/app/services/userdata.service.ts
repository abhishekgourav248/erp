import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable ,of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { env } from '../../env';

@Injectable({
  providedIn: 'root'
})
export class UserdataService {
  private data : any ;
  private baseURL : string;
  private userId:string | null;
  private token:string | null;
  constructor() {
    this.baseURL = env.apiURL;
    this.userId = localStorage.getItem('user_id');
    this.token = localStorage.getItem('token');
    if(this.userId == null || this.token == null) {
      //redirect to login page with query params error 401 unauthenticated...
    }
  }
  setUserData() {
    return this.fetchData().pipe(
      tap((responseData) => {
        this.data = responseData;
      }),
      catchError((error) => {
        // Handle errors appropriately
        console.error('Error fetching data:', error);
        return of(null);
      })
    );
  }

  updateUserData(data : any) {
    let payload = {
      name : data.name,
      is_checked_in : data.is_checked_in,
      user_type : data.user_type,
      user_id : data.user_id
    }
    let headers = {
      Authorization : `Bearer ${this.token}`
    }
    return this.postData(payload,headers).pipe(
      tap((response) => {
        this.data = response;
      }),
      catchError((error) => {
        return of(error)
      })
    )
  }

  fetchDataIfNeeded(): Observable<any> {
    if (this.data) {
      return of(this.data);
    } else {
      return this.fetchData().pipe(
        tap((responseData) => {
          this.data = responseData;
        }),
        catchError((error) => {
          // Handle errors appropriately
          console.error('Error fetching data:', error);
          return of(null);
        })
      );
    }
  }

  

  private fetchData(): Observable<any> {
    return new Observable<any>((observer) => {
      axios.get(`${this.baseURL}/get_user_details`,{
        params : {
          user_id : this.userId
        },
        headers: {
          Authorization : `Bearer ${this.token}`
        }
      }).then((res) => {
        const {status} = res.data;
        if(status) {
          observer.next(res.data.data);
          observer.complete();
        }
      }).catch((err) => {
        observer.error(err)
      })
    });
  }

  private postData(payload :any , headers:any): Observable<any> {
    return new Observable<any>((observer) => {
      axios.post(`${this.baseURL}/upsert_user_attendance`,payload, {headers}).then((res) => {
        const {status} = res.data;
        if(status) {
          observer.next(res.data.data);
          observer.complete();
        }
      }).catch((err) => {
        observer.error(err)
      })
    });
  }
}
