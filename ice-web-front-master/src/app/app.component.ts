import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationStart  } from '@angular/router';
import firebase from 'firebase/app';
import { environment } from 'src/environments/environment.prod';
import { FirebaseConfigService } from './Shared/Services/firebase-config.service';
import { SharedService } from './Shared/Services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'ice-web';
  path = ""
  availableContent:boolean=false;
  keysPressed:any[]=[];
  stopListening:boolean=false;
  LANG:any={};
  constructor(public router: Router,public shared:SharedService){
    
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.path=event.url.split("?")[0];
      }
    });
    firebase.initializeApp(environment.firebaseConfig);
   
  }
  ngOnInit(): void {
    this.shared.getLang().subscribe(lang => {
      if(lang=='ar'){
        this.LANG = environment.arabic_translations;
      }
      else {
        this.LANG = environment.english_translations;
        
      }
    });
  }
  // @HostListener('window:keydown', ['$event'])
  // onKeyDown(event: any){
  //   if(this.stopListening===false){
  //     this.keysPressed.push(event.key);
  //     if (this.keysPressed.length > 7) {
  //       this.keysPressed.shift();
  //     }
  //     if (this.keysPressed[0] === 'o' && this.keysPressed[1] === 'p' && 
  //         this.keysPressed[2] === 'e' && this.keysPressed[3] === 'n' && 
  //         this.keysPressed[4] === 'd' && this.keysPressed[5] === 'e' && 
  //         this.keysPressed[6] === 'v') {
  //           this.availableContent=true;
  //           localStorage.setItem('availableContent','1');
  //           this.stopListening=true;
  //     }
  //   }
 
  // }
}

