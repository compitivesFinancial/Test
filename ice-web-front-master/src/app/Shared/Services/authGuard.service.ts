import { Injectable } from '@angular/core';
import { Router , CanActivate } from '@angular/router';
import { SharedService } from './shared.service';

@Injectable({providedIn: 'root'})
export class authGuard implements CanActivate {
    public logged_in:boolean=false;


    constructor(private router: Router,private shared:SharedService) {
        this.shared.currentUserStatus.subscribe(user=>this.logged_in=user);
        if (localStorage.getItem('logged_in')) {
            this.logged_in=true;
        }
     }

    canActivate() {
      //  console.log(this.logged_in)
        if (this.logged_in) {
            return true;
        }
        this.router.navigate(['/login'])
        return false;
    }
}
