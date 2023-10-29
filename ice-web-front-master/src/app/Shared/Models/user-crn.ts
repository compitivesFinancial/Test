export class UserCrn {
  constructor(
    public id: string,
    public name: string,
    public username: string,
    public department_type: string,
    public department_role: string,
    public type: string,
    public cr_number_response: string,
    public admin_role_id: string,
    public kyc_approved_status: string,
    public kyc_note: string,
    public mobile_number: string,
    public country_code: string,
    public email: string,
    public password: string
  ) {}
}
