import { Backlog } from "./backlog.model";
import { UserStory } from "./userStory.model";

export class Sprint{
  _id?:string;
  title?:string; 
  goal?:string; 
  start_date?:string;
  end_date?:string;
  status?:string; 
  projectID?:string; 
  reviewStartTime?:string;
  reviewEndTime?:string;
  retroEndTime?:string;
  retroStartTime?:string;
  dailyEndTime?:string;
  dailyStartTime?:string;
  
  userStories?:UserStory[]=[];
  planning?: Event[]; 
  reviews?: Event[];
  retrospectives?:Event[] ;
  backlogId?:string;

  constructor( 
    _id:string,
 title:string,
  goal:string, 
  start_date:string,
  end_date:string,
  status:string, 
  projectID:string, 
  backlogId:string,
  reviewStartTime:string,
  reviewEndTime:string,
  retroEndTime:string,
  retroStartTime:string,
  dailyEndTime:string,
  dailyStartTime:string,
  userStories:[],
  planning: [], 
  reviews: [],
  retrospectives:[] ){
    this._id=_id
    this.title=title,
    this.goal=goal,
    this.start_date=start_date,
    this.end_date=end_date,
    this.status=status,
    this.dailyEndTime=dailyEndTime,
    this.dailyStartTime=dailyStartTime,
    this.retroStartTime=retroStartTime,
    this.retroEndTime=retroEndTime,
    this.reviewStartTime=reviewStartTime,
    this.reviewEndTime=retroEndTime,
    this.projectID=projectID,
    this.userStories=userStories,
    this.planning=planning,
    this.reviews=reviews,
    this.retrospectives=retrospectives,
    this.backlogId=backlogId,
    this.retroEndTime=retroEndTime,
    this.retroEndTime=retroEndTime
    
  }



}