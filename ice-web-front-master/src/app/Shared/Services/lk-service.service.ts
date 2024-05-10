import { Injectable } from '@angular/core';
import { Bank } from '../Models/bank';
import { Identity } from '../Models/identity';
import { Gender } from '../Models/gender';
import { FundUse } from '../Models/fund-use';
import { Education } from '../Models/education';
import { MaritalStatus } from '../Models/marital-status';
import { JobStatus } from '../Models/job-status';
import { Cities } from '../Models/cities';

@Injectable({
  providedIn: 'root',
})
export class LkServiceService {
  bankList: Array<Bank> = [];
  identityList: Array<Identity> = [];
  genderList: Array<Gender> = [];
  fundUseList: Array<FundUse> = [];
  educationList: Array<Education> = [];
  maritalStatusList: Array<MaritalStatus> = [];
  jobStatusList: Array<JobStatus> = [];
  yearsHijri: Array<number> = [];
  monthsHijri: Array<string> = [];
  days: Array<number> = [];
  grossIncome: Array<string> = [];
  financingType: Map<string, string> = new Map<string, string>();
  financingPeriod: Map<number, number> = new Map<number, number>();
  citiesList: Array<Cities> = [];

  constructor() {}
  /*************************************************************************/
  getGrossIncome() {
    if (this.grossIncome.length == 0) {
      this.grossIncome.push('0 - 100000');
      this.grossIncome.push('100000 - 500000');
      this.grossIncome.push('500000 + ');
    }
    return this.grossIncome;
  }
  /*************************************************************************/
  getFinancingPeriod() {
    this.financingPeriod = new Map<number, number>();
    for (let i = 6; i <= 36; i++) {
      this.financingPeriod.set(i, i);
    }
    return this.financingPeriod;
  }
  /*************************************************************************/
  getFinancingTyp() {
    this.financingType = new Map<string, string>([
      ['1', 'تمويل المشاريع'],
      ['2', 'مستخلصات'],
      ['3', 'تمويل رأس المال العامل '],
    ]);
    return this.financingType;
  }
  /*************************************************************************/
  getYearsHijri() {
    if (this.yearsHijri.length === 0) {
      for (let year = 1350; year < 1444; year++) {
        this.yearsHijri.push(year);
      }
    }
    return this.yearsHijri;
  }
  /*************************************************************************/
  getMonthsHijri() {
    if (this.monthsHijri.length === 0) {
      for (let month = 1; month <= 12; month++) {
        if (month < 10) {
          this.monthsHijri.push(`0${month}`);
        } else {
          this.monthsHijri.push(`${month}`);
        }
      }
    }
    return this.monthsHijri;
  }
  /*************************************************************************/
  getDays() {
    if (this.days.length === 0) {
      for (let day = 1; day <= 30; day++) {
        this.days.push(day);
      }
    }
    return this.days;
  }
  /*************************************************************************/
  getBankList() {
    if (this.bankList.length === 0) {
      this.bankList.push(
        new Bank('1', 'Saudi National Bank', 'البنك الأهلي السعودي', '1')
      );
      this.bankList.push(
        new Bank(
          '2',
          'The Saudi British Bank (SABB)',
          'البنك السعودي البريطاني (ساب)',
          '1'
        )
      );
      this.bankList.push(
        new Bank('3', 'Saudi Investment Bank', 'البنك السعودي للاستثمار', '1')
      );
      this.bankList.push(new Bank('4', 'Alinma bank', 'مصرف الإنماء', '1'));
      this.bankList.push(
        new Bank('5', 'Banque Saudi Fransi', 'البنك السعودي الفرنسي', '1')
      );
      this.bankList.push(new Bank('6', 'Riyad Bank', 'بنك الرياض', '1'));
      this.bankList.push(new Bank('7', 'Al Rajhi Bank', 'مصرف الراجحي', '1'));
      this.bankList.push(
        new Bank('8', 'Arab National Bank', 'البنك العربي الوطني', '1')
      );
      this.bankList.push(new Bank('9', 'Bank AlBilad', 'بنك البلاد', '1'));
      this.bankList.push(new Bank('10', 'Bank AlJazira', 'بنك الجزيرة', '1'));
      this.bankList.push(
        new Bank(
          '11',
          'Gulf International Bank Saudi Arabia (GIB-SA)',
          'بنك الخليج الدولي - السعودية',
          '1'
        )
      );
    }
    return this.bankList;
  }
  /*************************************************************************/
  getIdentityList() {
    if (this.identityList.length === 0) {
      this.identityList.push(new Identity('1', 'Saudi', 'سعودي', '1'));
      this.identityList.push(
        new Identity('2', 'Residence Permit', 'مقيم', '1')
      );
      this.identityList.push(new Identity('3', 'GCC', 'مجلس تعاون خليجي', '1'));
    }
    return this.identityList;
  }
  /*************************************************************************/
  getGenderList() {
    if (this.genderList.length === 0) {
      this.genderList.push(new Gender('1', 'Male', 'ذكر', '1'));
      this.genderList.push(new Gender('2', 'Female', 'أنثى', '1'));
    }
    return this.genderList;
  }
  /*************************************************************************/
  getFundUseList() {
    if (this.fundUseList.length === 0) {
      this.fundUseList.push(new FundUse('1', 'Opex', 'نفقات تشغيلية', '1'));
      this.fundUseList.push(new FundUse('2', 'Procurement', 'مشتريات', '1'));
      this.fundUseList.push(new FundUse('3', 'Lease', 'تأجير', '1'));
      this.fundUseList.push(new FundUse('4', 'Wages', 'رواتب', '1'));
      this.fundUseList.push(new FundUse('5', 'Others', 'اخرى', '1'));
    }
    return this.fundUseList;
  }
  /*************************************************************************/
  getMaritalStatus() {
    if (this.maritalStatusList.length === 0) {
      this.maritalStatusList.push(
        new MaritalStatus('1', 'Married', 'متزوج', '1')
      );
      this.maritalStatusList.push(
        new MaritalStatus('2', 'Single', 'اعزب', '1')
      );
      this.maritalStatusList.push(new MaritalStatus('3', 'Divorced', 'مطلق', '1'));
      this.maritalStatusList.push(new MaritalStatus('4', 'Widower', 'أرمل', '1'));
    }
    return this.maritalStatusList;
  }
  /*************************************************************************/
  getEducationList() {
    if (this.educationList.length === 0) {
      this.educationList.push(new Education('1', 'Doctorate', 'دكتوراة', '1'));
      this.educationList.push(new Education('2', 'Master', 'ماجستير', '1'));
      this.educationList.push(new Education('3', 'Bachelor', 'بكالوريوس', '1'));
      this.educationList.push(new Education('4', 'Deploma', 'دبلوم', '1'));
      this.educationList.push(
        new Education('5', 'Secondary edu', 'ثانوية عامه', '1')
      );
      this.educationList.push(new Education('6', 'others', 'اخرى', '1'));
    }
    return this.educationList;
  }
  /*************************************************************************/
  getCitiesList() {
    if (this.citiesList.length === 0) {
      this.citiesList.push(new Cities('1', 'Al Riyadh', 'الرياض', '1'));
      this.citiesList.push(new Cities('2', 'Eastern Region', 'المنطقة الشرقية', '1'));
      this.citiesList.push(new Cities('3', 'Mecca Al Mokarama', 'مكة المكرمة', '1'));
      this.citiesList.push(new Cities('8', 'Al Madina Al Moawra', 'المدينة المنورة', '1'));
      this.citiesList.push(new Cities('9', 'Al Qassim', 'القصيم', '1'));
      this.citiesList.push(new Cities('10', 'Assir', 'عسير', '1'));
      this.citiesList.push(new Cities('11', 'Tabouk', 'تبوك', '1'));
      this.citiesList.push(new Cities('12', 'Hail', 'حائل', '1'));
      this.citiesList.push(new Cities('13', 'Northern Borders', 'الحدود الشمالية', '1'));
      this.citiesList.push(new Cities('14', 'Jazan', 'جازان', '1'));
      this.citiesList.push(new Cities('15', 'Najran', 'نجران', '1'));
      this.citiesList.push(new Cities('16', 'Al Baha', 'الباحة', '1'));
      this.citiesList.push(new Cities('17', 'Al Jouf', 'الجوف', '1'));
    }
    return this.citiesList;
  }
  /*************************************************************************/
  getJobStatusList() {
    if (this.jobStatusList.length === 0) {
      this.jobStatusList.push(new JobStatus('1', 'Employed', 'موظف', '1'));
      this.jobStatusList.push(
        new JobStatus('2', 'Unemployed', 'غير موظف', '1')
      );
      this.jobStatusList.push(new JobStatus('3', 'Student', 'طالب علم', '1'));
      this.jobStatusList.push(
        new JobStatus('4', 'لآusinessman', 'رجل أعمال', '1')
      );
      this.jobStatusList.push(new JobStatus('5', 'Retired و', 'متقاعد', '1'));
    }
    return this.jobStatusList;
  }
}
