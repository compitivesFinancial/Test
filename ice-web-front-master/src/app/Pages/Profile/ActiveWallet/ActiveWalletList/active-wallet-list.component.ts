import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { environment } from 'src/environments/environment';
declare const $:any;
@Component({
  selector: 'app-active-wallet-list',
  templateUrl: './active-wallet-list.component.html',
  styleUrls: ['./active-wallet-list.component.css']
})
export class ActiveWalletListComponent implements OnInit {

  subscriptions:Subscription[]=[];
  LANG:any={};
  
  constructor(private shared:SharedService) { 
    this.subscriptions.push(this.shared.languageChange.subscribe((path:any)=>{
      this.changeLanguage();
    }))
    this.changeLanguage();
  }

  ngOnInit(): void {

    
    // $('.chart').easyPieChart({
    //   barColor: '#ef1e25',
    //   trackColor: '#f9f9f9',
    //   scaleColor: '#dfe0e0',
    //   scaleLength: 5,
    //   lineCap: 'round',
    //   lineWidth: 3,
    //   trackWidth: undefined,
    //   size: 110,
    //   rotate: 0, // in degrees
    //   animate: {
    //     duration: 1000,
    //     enabled: true
    //   },
    //   easing: function (x:any, t:any, b:any, c:any, d:any) { // easing function
    //     t = t / (d/2);
    //     if (t < 1) {
    //       return c / 2 * t * t + b;
    //     }
    //     return -c/2 * ((--t)*(t-2) - 1) + b;
    //   }
    // });

    
          $('.chart').easyPieChart({
              easing: 'easeOutElastic',
              delay: 3000,
              barColor: '#00C48A',
              trackColor: '#DBF8EE',
              scaleColor: false,
              lineWidth: 5,
              trackWidth: 2,
              size: 125,
              lineCap: 'round',
              onStep: function (from:any, to:any, percent:any) {
                  this.el.children[0].innerHTML = Math.round(percent);
              }
          });


  }
  changeLanguage(){
    if(localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
        this.LANG=environment.arabic_translations;
    }
    else {
        this.LANG=environment.english_translations;
    }
  }
}
