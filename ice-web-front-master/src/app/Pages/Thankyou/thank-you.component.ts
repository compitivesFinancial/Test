import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.css']
})
export class ThankYouComponent implements OnInit {


  LANG: any = ""

  constructor(private shared: SharedService) {
    this.shared.languageChange.subscribe((path: any) => {
      this.changeLanguage();
    })
    this.changeLanguage();
  }

  changeLanguage() {
    if (localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
      this.LANG = environment.arabic_translations;
    }
    else {
      this.LANG = environment.english_translations;
    }
  }
  
  ngOnInit(): void {
  }

}
