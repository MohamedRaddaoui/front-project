export class User{
  _id?:string;
  firstname:string;
  lastname: string;
  email: string;
  password: string;
  role: string;
  status: string;

  twoFACode:  string;
  twoFACodeExpires: Date;
  photo?:string;
  constructor(
    _id:string,
    firstname:string,

    lastname: string,
    email: string,
    password: string,
    role: string,
    status: string,
    
    twoFACode:  string,

  
    twoFACodeExpires: Date,
    photo:string,
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