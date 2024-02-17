import { Component, OnInit, Input, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { SharedService } from '../../Services/shared.service';
import firebase from 'firebase';
import { decryptAesService } from '../../Services/decryptAES.service';
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
  LANG:any = {};
  selected_language: string = "";
  optional_language: string = "";
  logo: string = "assets/images/main-logo.png";
  logo_1: string = "assets/images/main-logo1.png";
  menuToggle: boolean = false;
  phoneMenuToggle: boolean = false;
  disabledUI:boolean=true;
  usernameTemp:any='';
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
      this.shared.changeUserData(this.user_data);
    }
    if(localStorage.getItem("arabic") ===null || localStorage.getItem("arabic")==="true"){
      this.shared.setLang('ar');
      localStorage.setItem("arabic", "true");
      this.shared.getLang().subscribe(lang => {
        if(lang==='ar'){
          this.LANG = environment.arabic_translations;
          this.selected_language = "Ar";
          this.optional_language = "English";
          document.documentElement.classList.add('ar');
          this.logo = "assets/images/main-logo-ar.png";
          this.logo_1 = "assets/images/main-logo1-ar.png";
        }
      }); 
     }
     else {
      this.shared.setLang('en');
      localStorage.setItem("arabic", "false");
      this.shared.getLang().subscribe(lang => {
      if(lang!=='ar'){
        this.LANG = environment.english_translations;
        this.selected_language = "En";
        this.optional_language = "Arabic";
        document.documentElement.classList.remove('ar');
        this.logo = "assets/images/main-logo-ar.png";
        this.logo_1 = "assets/images/main-logo1-ar.png";
      }
    });
     }
  }


  ngOnInit(): void {
    if(localStorage.getItem('availableContent')==='1')
    this.disabledUI=false;
  this.shared.getName().subscribe(userName=>{
    this.usernameTemp=userName; 
  });
  }

  close() {
    $(".navbar-collapse").removeClass("show");
  }
  toggleMenu() {

    this.menuToggle = !this.menuToggle;
  
  }
  togglePhoneMenu(){
    this.phoneMenuToggle= !this.phoneMenuToggle;
  }
  changeLanguage() {
    if (this.optional_language == "Arabic") {
      localStorage.setItem("arabic", "true");
      this.LANG = environment.arabic_translations;
      this.shared.setLang('ar');
      document.documentElement.classList.add('ar');
      this.selected_language = "Ar";
      this.optional_language = "English";
      this.shared.emitLanguageChange(location.pathname);
      this.logo = "assets/images/main-logo-ar.png";
      this.logo_1 = "assets/images/main-logo1-ar.png";
    }
    else {
      localStorage.setItem("arabic", "false");
      this.shared.setLang('en');
      this.LANG = environment.english_translations;
      document.documentElement.classList.remove('ar');
      this.selected_language = "En";
      this.optional_language = "Arabic";
      this.logo = "assets/images/main-logo.png";
      this.logo_1 = "assets/images/main-logo1.png";
      this.shared.emitLanguageChange(location.pathname);
    }
   
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
    this.toast.success("Logout successfully.");
    firebase.auth().currentUser?.delete().then(() => { }).catch((error: any) => { alert(error) });
    localStorage.removeItem('firebaseUser');
    this.toast.success("Logout successfully.");
    setTimeout(() => {
      this.router.navigate(["/login"]);
    }, 500);
  }

}
