import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { environment } from 'src/environments/environment';

declare const $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  logged_in: boolean = false;
  user_data: any = {};
  subscriptions: Subscription[] = [];
  @Input() path!: string;
  LANG = environment.english_translations;
  selected_language: string = "";
  optional_language: string = "";
  logo: string = "assets/images/main-logo.png";
  logo_1: string = "assets/images/main-logo1.png";


  constructor(private shared: SharedService, private router: Router, private toast: ToastrService,public decryptAES:decryptAesService) {
    this.subscriptions.push(this.shared.currentUserStatus.subscribe(user => this.logged_in = user));
    this.subscriptions.push(this.shared.currentUserData.subscribe(user => { this.user_data = user }));
    if (localStorage.getItem('logged_in') != undefined) {
      this.logged_in = true;
      this.shared.changeUserStatus(true);
    }
    const user_data = btoa(btoa("user_info_web"));
    if (localStorage.getItem(user_data) != undefined) {
      this.user_data = JSON.parse(atob(atob(localStorage.getItem(user_data) || '{}')));
     
      this.shared.changeUserData(this.user_data)
    }

    if (localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
      this.LANG = environment.arabic_translations;
      this.selected_language = "Ar";
      this.optional_language = "English";
      document.documentElement.classList.add('ar');
    }
    else {
      this.LANG = environment.english_translations;
      this.selected_language = "En";
      this.optional_language = "Arabic"
      document.documentElement.classList.remove('ar');
    }
  }

  ngOnInit(): void {
  }

  close() {
    $(".navbar-collapse").removeClass("show");
  }

  changeLanguage() {
    if (this.optional_language == "Arabic") {
      localStorage.setItem("arabic", "true");
      this.LANG = environment.arabic_translations;
      document.documentElement.classList.add('ar');
      this.selected_language = "Ar";
      this.optional_language = "English";
      this.shared.emitLanguageChange(location.pathname);
      this.logo = "assets/images/main-logo-ar.png";
      this.logo_1 = "assets/images/main-logo1-ar.png";
      return
    }
    localStorage.setItem("arabic", "false");
    this.LANG = environment.english_translations;
    document.documentElement.classList.remove('ar');
    this.selected_language = "En";
    this.optional_language = "Arabic";
    this.logo = "assets/images/main-logo.png";
    this.logo_1 = "assets/images/main-logo1.png";
    this.shared.emitLanguageChange(location.pathname);
  }
  goHome() {
    // if(!this.logged_in){
    //   return
    // }
    this.router.navigate(["/"])
  }

  goToLogin(type: string) {
    this.router.navigate(["/register"], { queryParams: { type: btoa(btoa(type)) } })
    this.close();
  }

  logout() {
 
    localStorage.clear();
    this.shared.changeUserStatus(false);
    this.shared.changeUserData({});
    this.user_data = {};
    this.toast.success("Logout successfully.")
    setTimeout(() => {
      this.router.navigate(["/login"]);
    }, 500);
  }

}
