import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { environment } from 'src/environments/environment.prod';
declare const $:any;
@Component({
  selector: 'app-active-wallet-details',
  templateUrl: './active-wallet-details.component.html',
  styleUrls: ['./active-wallet-details.component.css']
})
export class ActiveWalletDetailsComponent implements OnInit {

  subscriptions:Subscription[]=[];
  LANG:any={};
  
  constructor(private shared:SharedService) { 
   
    this.changeLanguage();
  }

  ngOnInit(): void {

    $('.chart').easyPieChart({
      easing: 'easeOutElastic',
      delay: 3000,
      barColor: '#00C48A',
      trackColor: '#DBF8EE',
      scaleColor: false,
      lineWidth: 5,
      trackWidth: 2,
      size: 267,
      lineCap: 'round',
      onStep: function (from:any, to:any, percent:any) {
          this.el.children[0].innerHTML = Math.round(percent);
      }
  });


  }
  changeLanguage(){
    
    this.shared.getLang().subscribe(lang => {
      if(lang=='ar'){
        this.LANG = environment.arabic_translations;
      }
      else {
        this.LANG = environment.english_translations;
        
      }
    });
  }
}
