
import { Sprint } from "./sprint.model";
import { Task } from "./task.model";


export class Project{
    id?:string;
    title?:string;
    description?:string;
    startDate?:string   
    endDate?:string
    ownerID?:string
    team?:number 
    status?:string
    category?:string
    usersID?:[]
    archived?:boolean
    summarySent?: boolean;
    type?:string;
     tasksID?: Task[];
     sprintsID?: Sprint[];
    
  constructor( 
    
    title?:string,
    description?:string,
    startDate?:string ,  
    endDate?:string,
    ownerID?:string,
    team?:number ,
    status?:string,
    category?:string,
    usersID?:[],
    archived?:boolean,
    summarySent?: boolean,
    type?:string,
    tasksID?:[],
    sprintsID?: Sprint[],){
        
        
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
       

    }
}