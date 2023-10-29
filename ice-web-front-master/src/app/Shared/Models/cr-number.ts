export class CrNumber {
  constructor(
    public crName: string,
    public crNumber: string,
    public crEntityNumber: string,
    public issueDate: string,
    public expiryDate: string,
    public crMainNumber: string,
    public crMainEntityNumber: string,
    public parties: Partiey[],
    public businessType: BusinessType,
    public fiscalYear: FiscalYear,
    public status: Status,
    public cancellation: string,
    public address: Address,
    public isEcommerce: string,
    public urls: string,
    public location: Location,
    public company: Company,
    public capital: Capital,
    public activities: Activity
  ) {}
}
/*******************************************************************************/
class Isic{
  constructor(
    public description: string,
    public name: string,
    public nameEn: string
  ) {}
}
/*******************************************************************************/
class Activity{
  constructor(
    public description: string,
    public isic: Isic,
  ) {}
}
/*******************************************************************************/
class Capital {
  constructor(
    public paidAmount: string,
    public subscribedAmount: string,
    public announcedAmount: string,
    public share: string
  ) {}
}
/*******************************************************************************/
class Company {
  constructor(
    public period: string,
    public startDate: string,
    public endDate: string
  ) {}
}
/*******************************************************************************/
class Location {
  constructor(public id: string, public name: string) {}
}
/*******************************************************************************/
class Partiey {
  constructor(
    public name: string,
    public birthDate: string,
    public sharesCount: string,
    public gross: string,
    public identity: Identity,
    public relation: Relation,
    public nationality: Nationality
  ) {}
}
/*******************************************************************************/
class Nationality {
  constructor(public id: string, public name: string) {}
}
/*******************************************************************************/
class Relation {
  constructor(public id: string, public name: string) {}
}
/*******************************************************************************/
class Identity {
  constructor(public id: string, public type: string) {}
}
/*******************************************************************************/
class BusinessType {
  constructor(public id: string, public name: string) {}
}
/*******************************************************************************/
class FiscalYear {
  constructor(
    public month: string,
    public day: string,
    public calendarType: CalendarType
  ) {}
}
/*******************************************************************************/
class CalendarType {
  constructor(public id: string, public name: string) {}
}
/*******************************************************************************/
class Status {
  constructor(public id: string, public name: string, public nameEn: string) {}
}
/*******************************************************************************/
class Address {
  constructor(public general: General, public national: string) {}
}
/*******************************************************************************/
class General {
  constructor(
    public website: string,
    public national: string,
    public email: string,
    public zipcode: string,
    public fax1: string,
    public telephone1: string,
    public telephone2: string,
    public postalBox1: string,
    public postalBox2: string
  ) {}
}
