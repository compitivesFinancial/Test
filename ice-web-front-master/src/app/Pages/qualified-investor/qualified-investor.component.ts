import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { environment } from 'src/environments/environment.prod';
import { DashboardService } from '../Dashboard/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import firebase from 'firebase/app';
import 'firebase/storage';
import { QualifiedInvestor } from 'src/app/Shared/Models/qualified-investor';
import { QualifiedInvestorService } from 'src/app/Shared/Services/qualified-investor.service';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qualified-investor',
  templateUrl: './qualified-investor.component.html',
  styleUrls: ['./qualified-investor.component.css'],
})
export class QualifiedInvestorComponent implements OnInit {
  subscriptions: Subscription[] = [];
  user_data: any = {};
  LANG: any = {};
  public profileDetails: any = '';
  errors: any = {};
  err: boolean = false;
  upload_called: boolean = false;
  load: boolean = false;
  image_count: number = 0;
  uploaded_count: number = 0;
  disableSave: any;
  min3WorkYear: any = {}; //1
  certificateCME1: any = {}; //2
  professionalCertificate: any = {}; //3
  investTenOpport: any = {}; //4
  netOrigin: any = {}; //5

  /************************************************************************************/
  constructor(
    private toast: ToastrService,
    private shared: SharedService,
    public dashBoardService: DashboardService,
    public qualifiedInvestorService: QualifiedInvestorService,public decryptAES:decryptAesService, private router: Router
  ) {
    const user_data = btoa(btoa('user_info_web'));
    if (localStorage.getItem(user_data) != undefined) {
      this.user_data = JSON.parse(
        atob(atob(localStorage.getItem(user_data) || '{}'))
      );
    }
   
   
    this.changeLanguage();
    this.profile();
    this.getQualifiedInvestorData();
   // console.log(`THE this.min3WorkYear img = ${this.min3WorkYear?.image}`);
  }
  /************************************************************************************/
  ngOnInit(): void { }
  /************************************************************************************/
  getQualifiedInvestorData() {
    this.subscriptions.push(
      this.qualifiedInvestorService.getQualifiedInvestorData(this.user_data.id).subscribe((res: any) => {
        if (res.status) {
          const object = res.response[0];
          this.min3WorkYear = { "image": object.min3WorkYear_url, "file": '', "extension": '' };
          this.certificateCME1 = { "image": object.certificateCME1_url, "file": '', "extension": '' };
          this.professionalCertificate = { "image": object.professionalCertificate_url, "file": '', "extension": '' };
          this.investTenOpport = { "image": object.investTenOpport_url, "file": '', "extension": '' };
          this.netOrigin = { "image": object.netOrigin_url, "file": '', "extension": '' };
          this.disableSave = false;
        }
      })
    );
  }
  /************************************************************************************/
  changeLanguage() {
    this.shared.getLang().subscribe(lang => {
      if(lang=='ar'){
        this.LANG = environment.arabic_translations;
      }
      else {
        this.LANG = environment.english_translations;
        
      }
    });
  }
  /************************************************************************************/
  profile() {
    let data = {
      id: this.user_data.id,
    };
    this.dashBoardService.profileDetails(data).subscribe((res: any) => {
      this.profileDetails = res.response;
   //   console.log(this.profileDetails);
    });
  }
  /************************************************************************************/

  showFileInput(id: any) {
    let fileInput;
    switch (id) {
      case 1:
        fileInput = document.getElementById('min3WorkYear') as HTMLInputElement;
        break;
      case 2:
        fileInput = document.getElementById(
          'certificateCME1'
        ) as HTMLInputElement;
        break;
      case 3:
        fileInput = document.getElementById(
          'professionalCertificate'
        ) as HTMLInputElement;
        break;
      case 4:
        fileInput = document.getElementById(
          'investTenOpport'
        ) as HTMLInputElement;
        break;
      case 5:
        fileInput = document.getElementById('netOrigin') as HTMLInputElement;
        break;
      default:
        fileInput = document.getElementById('min3WorkYear') as HTMLInputElement;
    }
    fileInput.click();
  }
  /************************************************************************************/
  changeImageFile(event: any, type: any) {
    let file = event.target.files[0];
    let ext = file.type.split('/').pop().toLowerCase();
    if (ext !== 'jpeg' && ext !== 'jpg' && ext !== 'png' && ext !== 'pdf') {
      this.toast.warning('', file.name + 'is not a valid file');
      return false;
    }
    if (file) {
      let reader = new FileReader();
      switch (type) {
        case 1:
          reader.onload = (e: any) => {
            this.min3WorkYear = {
              image: e.target.result,
              file: file,
              extension: ext,
            };
          };
          break;
        case 2:
          reader.onload = (e: any) => {
            this.certificateCME1 = {
              image: e.target.result,
              file: file,
              extension: ext,
            };
          };
          break;
        case 3:
          reader.onload = (e: any) => {
            this.professionalCertificate = {
              image: e.target.result,
              file: file,
              extension: ext,
            };
          };
          break;
        case 4:
          reader.onload = (e: any) => {
            this.investTenOpport = {
              image: e.target.result,
              file: file,
              extension: ext,
            };
          };
          break;
        case 5:
          reader.onload = (e: any) => {
            this.netOrigin = {
              image: e.target.result,
              file: file,
              extension: ext,
            };
          };
          break;
        default:
        //  console.log('The file not exist');
          break;
      }
      reader.readAsDataURL(file);
    }
    return;
  }

  /************************************************************************************/
  upgradeToQualified() {
    this.err = false;
    this.errors = {};
    if (this.min3WorkYear.file.size > 10485760 || this.certificateCME1.file.size > 10485760 || this.investTenOpport.file.size > 10485760 || this.netOrigin.file.size > 10485760){
      this.toast.warning("Each file should NOT exceed 10MB");
    }
      this.errorHandler();
    if (this.err) return;
    this.load = true;
    if (this.min3WorkYear.file) {
      this.uploadImage(this.min3WorkYear);
      this.image_count += 1;
    }
    if (this.certificateCME1.file) {
      this.uploadImage(this.certificateCME1);
      this.image_count += 1;
    }
    if (this.professionalCertificate.file) {
      this.uploadImage(this.professionalCertificate);
      this.image_count += 1;
    }
    if (this.investTenOpport.file) {
      this.uploadImage(this.investTenOpport);
      this.image_count += 1;
    }
    if (this.netOrigin.file) {
      this.uploadImage(this.netOrigin);
      this.image_count += 1;
    }
  }
  /************************************************************************************/
  addQualifiedInvestor() {
    const data: QualifiedInvestor = {
      investor_id: this.user_data.id,
      min3WorkYear_url: this.min3WorkYear.image,
      certificateCME1_url: this.certificateCME1.image,
      professionalCertificate_url: this.professionalCertificate.image,
      investTenOpport_url: this.investTenOpport.image,
      netOrigin_url: this.netOrigin.image,
    };
    this.subscriptions.push(
      this.qualifiedInvestorService
        .addQualifiedInvestor(data)
        .subscribe((res: any) => {
          this.load = false;
          if (res.status) {
            this.toast.success('Application added successfully!');
            this.router.navigate(["/dashboard"]);
            return;
          }
          this.toast.warning(res.response.message);
        })
    );
  }
  /************************************************************************************/
  errorHandler() {
    if (this.min3WorkYear.file == '' || this.min3WorkYear.file == undefined || this.min3WorkYear.file.size > 10485760) {
      this.errors.min3WorkYear = true;
      this.err = true;
    }
    if (
      this.certificateCME1.file == '' ||
      this.certificateCME1.file == undefined || this.certificateCME1.file.size > 10485760
    ) {
      this.errors.certificateCME1 = true;
      this.err = true;
    }
    if (
      this.professionalCertificate.file == '' ||
      this.professionalCertificate.file == undefined || this.professionalCertificate.file.size > 10485760
    ) {
      this.errors.professionalCertificate = true;
      this.err = true;
    }
    if (
      this.investTenOpport.file == '' ||
      this.investTenOpport.file == undefined || this.investTenOpport.file.size > 10485760
    ) {
      this.errors.investTenOpport = true;
      this.err = true;
    }
    if (this.netOrigin.file == '' || this.netOrigin.file == undefined || this.netOrigin.file.size > 10485760) {
      this.errors.netOrigin = true;
      this.err = true;
    }
  }
  /************************************************************************************/
  uploadImage(data: any) {
    this.load = true;
    this.upload_called = true;
    var currDate = Date.now();
    var fileName = data.file.name;
    var path = fileName + currDate;
    const filePath = `qulaified-inestor/${path}`;
    this.load = true;
    const uploadTask = firebase
      .storage()
      .ref()
      .child(`${filePath}`)
      .put(data.file);
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        data.progress = progress;
      },
      (error) => console.log(error),
      async () => {
        await uploadTask.snapshot.ref.getDownloadURL().then((res) => {
          data.image = res;
          this.uploaded_count += 1;
          if (this.uploaded_count == 5) {
            this.addQualifiedInvestor();
          }
        });
      }
    );
  }
}
