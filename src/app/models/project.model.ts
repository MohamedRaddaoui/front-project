export class Project{
  
    title?:String;
    description?:String;
    startDate?:String   
    endDate?:String
    ownerID?:String
    team?:Number 
    status?:String
    category?:String
    usersID?:String
    archived?:Boolean
    summarySent?: Boolean;
    type?:String;
    categorie?:String;

  constructor( 
    
    title?:String,
    description?:String,
    startDate?:String ,  
    endDate?:String,
    ownerID?:String,
    team?:Number ,
    status?:String,
    category?:String,
    usersID?:String,
    archived?:Boolean,
    summarySent?: Boolean,
    type?:String,
    categorie?:String,){
        
        this.title=title,
        this.description=description,
        this.startDate=startDate,
        this.endDate=endDate,
        this.ownerID=ownerID,
        this.team=team,
        this.status=status,
        this.category=category,
        this.usersID=usersID,
        this.archived=archived,
        this.summarySent=summarySent,
        this.type=type,
        this.categorie=categorie

    }
}