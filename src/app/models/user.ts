export class User{
  _id?:string;
  firstname:string;
  lastname: String;
  email: String;
  password: String;
  role: String;
  status: String;
  twoFACode:  String;
  twoFACodeExpires: Date;
  photo?:String;
  constructor(
    _id:string,
    firstname:string,
    lastname: String,
    email: String,
    password: String,
    role: String,
    status: String,
    photo: String,
    twoFACode:  String,
    twoFACodeExpires: Date,
  ) {
    this._id=_id;
    this.firstname=firstname;
    this.lastname= lastname;
    this.email= email;
    this.password=password;
    this.role= role;
    this.status= status;
    this.twoFACode= twoFACode;
    this.twoFACodeExpires= twoFACodeExpires;
    this.photo = photo;
}
  
}