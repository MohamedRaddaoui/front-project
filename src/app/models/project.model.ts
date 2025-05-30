
import { Sprint } from "./sprint.model";
import { Task } from "./task.model";
import { User } from "./user";


export class Project{
    _id?:string;
    title?:string;
    description?:string;
    startDate?:string   
    endDate?:string
    ownerID?:User;
    team?:number 
    status?:string
    category?:string
    usersID?:User[]
    archived?:boolean
    summarySent?: boolean;
    type?:string;
    tasksID?: Task[];
    sprintsID?: Sprint[];
    created_by?:User;
     showFullDescription?: boolean;
    
  constructor( 
    _id?:string,
    
    title?:string,
    description?:string,
    startDate?:string ,  
    endDate?:string,
    ownerID?:User,
    team?:number ,
    status?:string,
    category?:string,
    usersID?:User[],
    archived?:boolean,
    summarySent?: boolean,
    type?:string,
    tasksID?:[],
    sprintsID?: Sprint[],
    created_by?:User,
   showFullDescription?: boolean,){
        this._id=_id,
        
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
        this.tasksID=tasksID
        this.sprintsID=sprintsID
        this.created_by=created_by
        this.showFullDescription = showFullDescription || false; // Initialize with false if not provided
       

    }
}