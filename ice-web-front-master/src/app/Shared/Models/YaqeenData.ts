export class YaqeenData {
    constructor(
        public status: boolean,
        public birthDateG: string,
        public familyName: string,
        public familyNameT: string,
        public fatherName: string,
        public fatherNameT: string,
        public firstName: string,
        public firstNameT: string,
        public grandFatherName: string,
        public grandFatherNameT: string,
        public nationalityDescAr: string,// for iqama only
        public sexDescAr: string,
        public idExpirationDate: string,
        public subTribeName:string// for sudi only
    ) { }
}