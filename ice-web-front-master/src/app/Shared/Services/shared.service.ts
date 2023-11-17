import {Injectable, EventEmitter} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({providedIn: 'root'})

export class SharedService {
    
    private isLoggedIn:boolean=false;
    private userInfo:any={};


    private loggedIn = new BehaviorSubject(this.isLoggedIn);
    private user_info = new BehaviorSubject(this.userInfo);
    private lang = new BehaviorSubject('ar');
    private name = new BehaviorSubject('');
    private opportunity = new BehaviorSubject('');
    languageChange = new EventEmitter();



    
    currentUserStatus =this.loggedIn.asObservable();
    currentUserData=this.user_info.asObservable();
    changeUserStatus(user:boolean){
        this.loggedIn.next(user);
    }


    changeUserData(data:Object){
        this.user_info.next(data);
    }


    emitLanguageChange(path: string) {
        this.languageChange.emit(path);
    }
    public setLang(lang: string) {
        return this.lang.next(lang);
      }
      public getLang(): Observable<string> {
        return this.lang.asObservable();
      }
      public setName(name: string) {
        return this.name.next(name);
      }
      public getName(): Observable<string> {
        return this.name.asObservable();
      } 
      public setOpportunity(opportunity: any) {
        return this.opportunity.next(opportunity);
      }
      public getOpportunity(): Observable<any> {
        return this.opportunity.asObservable();
      } 

    
}