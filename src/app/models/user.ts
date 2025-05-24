export class User{
  firstname:String;
  lastname: String;
  email: String;
  password: String;
  role: String;
  status: String;
  twoFACode:  String;
  twoFACodeExpires: Date;
  photo?:String;
  constructor(
    firstname:String,
    lastname: String,
    email: String,
    password: String,
    role: String,
    status: String,
    twoFACode:  String,
    twoFACodeExpires: Date,
    photo:String,
  ) {
    this.firstname=firstname;
    this.lastname= lastname;
    this.email= email;
    this.password=password;
    this.role= role;
    this.status= status;
    this.twoFACode= twoFACode;
    this.twoFACodeExpires= twoFACodeExpires;
    this.photo=photo
}
  
}