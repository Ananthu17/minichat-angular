import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http"
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http:HttpClient , private router: Router ,private toastr: ToastrService) { }

  ngOnInit(): void {
  }
  user=""
  showsignup(){
    console.log("ananthu");
    $('#card').addClass('d-none')
    $('#card-signup').removeClass('d-none')
  }
  showlogin(){
    console.log("nanthu");
    $('#card').removeClass('d-none')
    $('#card-signup').addClass('d-none')
  }
  attendance = {}
  
  onSubmit(data){
    this.http.post('http://127.0.0.1:8000/api-token-auth/',data)
    .subscribe((result)=>{
      this.user=data.username
      console.log("username:",this.user)
      this.attendance= result
      localStorage.setItem('token',this.attendance["token"])
      localStorage.setItem('user',data.username)
      this.router.navigate(['home']);
      console.log(localStorage['token'])
    },
    (error)=>{
      this.toastr.error("Invalid Credentials");
    }
    )
  }
  onSignup(data){
    this.http.post('http://127.0.0.1:8000/signup',data)
    .subscribe((result)=>{
      this.toastr.success("Account created successfully");
      $('#card').removeClass('d-none')
      $('#card-signup').addClass('d-none')
    },
    (error)=>{
      this.toastr.error("Invalid details..!");
    })
    
  }
  decoded_token(){
    const token_parts = this.attendance["token"].split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    console.log(token_decoded);
  }
}


declare var $: any;
console.log(`jQuery version: ${$.fn.jquery}`);

