import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http"
import { ToastrService } from 'ngx-toastr';
import {LoginComponent} from '../login/login.component';
import { Route,Router} from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit{

  // calling all chats when logged in 
  constructor(private http:HttpClient,private toastr: ToastrService,private loginComponent:LoginComponent,private router: Router) {
      this.chats = {}
      this.http.get('http://65.2.126.93/users/').subscribe(
      (result) => {
      this.chats = result
      // calling chatlist function 
      this.chatList(this.chats)
      })
  }

  // initilaze socket 
  ngOnInit(){
    
  }
  
  // variables 
  token_decoded = {}
  chats = {}
  currentUser = ""
  socket:WebSocket;
  contacts = []
  url = ""
  friend = ""
  msgList = []
  chatStatus = false

  // for displaying contacts 
  chatList(data){
    for (var index = 0; index < data.length; index++) { 
      if (data[index].username != localStorage['user']){
        this.contacts.push({"id":data[index].id,"friend":data[index].username,"user":localStorage['user']})
      }
    }
    console.log("contacts",this.contacts)
  }
  openChat(username,chatid,friend){
    this.http.post('http://65.2.126.93/findchat/',{"user":username,"friend":friend}).subscribe(
      (result) => {
        this.setsock(result[0].id)
    })
    this.friend = friend
    this.currentUser = localStorage['user']
    this.msgList = []
    this.chatStatus = true
    this.decoded_token()
  }

  setsock(url) {
    this.socket = new WebSocket("ws://65.2.126.93/ws/chat/"+url+"/");
    this.socket.onopen = () => {
      console.log('WebSockets connection created.');
    };

    this.socket.onclose = (event) => {
      console.error('Chat socket closed unexpectedly');
    };

    this.socket.onmessage = (event) => {
      var data = event.data
      var parsedData = JSON.parse(data)
      console.log("parseddata",parsedData)
      this.toastr.success("New messege..!",parsedData.message.content);
      parsedData.message["friend"] = this.friend
      this.msgList.push(parsedData.message)
    };
  }

  // on change after inputs
  start(event) {
    this.sendMessage({
      command:"new_message",
      from:localStorage['user'],
      message:event.value,
      chatId:"1"
    });
    event.value = ""
  }

  fetchMsg(username,chatid):any{
    this.sendMessage({
      command:"fetch_messages",
      username:username,
      chatId:chatid
    });
  }

  // sending socket msg 
  sendMessage(data){
    try{
      this.socket.send(JSON.stringify({...data}))
    }catch(err){
      console.log(err)
    }
  }

  decoded_token(){
    const token_parts = localStorage.getItem('token').split(/\./);
    this.token_decoded = JSON.parse(window.atob(token_parts[1]));
  }


  logout(){
    localStorage.setItem('token',"")
    this.router.navigate(['login'])
  }
}
