import { User } from "@syncfusion/ej2-angular-interactive-chat";
import { Sprint } from "./sprint.model";
import { Backlog } from "./backlog.model";

export class UserStory{
  _id?:string
     title?:string;
  description?: string;
  status?:string;
  priority?:string ;
  storyPoints?:number ;
  backlogID?:string;
  sprintID?:string ;
  assignedTo?: string

  constructor( 
    _id:string,
  title:string,
  description: string,
  status:string,
  priority:string ,
  storyPoints:number ,
  backlogID:string,
  sprintID:string ,
  assignedTo: string){
    this._id=_id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.priority=priority;
    this.storyPoints=storyPoints;
    this.backlogID=backlogID
    this.sprintID=sprintID;
    this.assignedTo=assignedTo;

  }
}
