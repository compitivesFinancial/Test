import { Injectable } from '@angular/core';
import { Router , CanActivate } from '@angular/router';
import { SharedService } from './shared.service';

@Injectable({providedIn: 'root'})
export class noLoggedIn implements CanActivate {
    public logged_in:boolean=false;


    constructor(private router: Router,private shared:SharedService) {
        this.shared.currentUserStatus.subscribe(user=>this.logged_in=user);
        if (localStorage.getItem('logged_in')) {
            this.logged_in=true;
        }
    }

    canActivate() {
        if (this.logged_in) { 
            this.router.navigate(['/'])
            return true;
        }
        return true;
    }
}
