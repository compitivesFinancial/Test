import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth'
@Injectable({
  providedIn: 'root'
})
export class FirebaseConfigService {
 private apiKey:string = "AIzaSyAkw7ImOFHF3I5y52W2yydQb9ANhpuR-3E";
 private authDomain:string = "aaaa-6d056.firebaseapp.com";
 private  databaseURL:string =  "https://aaaa-6d056-default-rtdb.firebaseio.com";
 private  projectId:string =  "aaaa-6d056";
 private storageBucket:string =  "aaaa-6d056.appspot.com";
 private messagingSenderId:string =  "1021417514491";
 private appId:string =  "1:1021417514491:web:22abc3ab52fbafe486d75e";
 private measurementId:string = "G-GEMW853ESY";
  isLoggedIn: boolean=false;
  constructor(public firebaseAuth:AngularFireAuth) { }
  // async signin(email:string,password:string){
  //   await this.firebaseAuth.signInWithEmailAndPassword(email,password).then(res=>{
  //     this.isLoggedIn=true;
  //     localStorage.setItem('firebaseUser',JSON.stringify(res.user))
  //   });
  // };
  // async signup(email:string,password:string){
  //   await 
  // }
  logout(){
    this.firebaseAuth.signOut();
    localStorage.removeItem('firebaseUser');
  }
}
