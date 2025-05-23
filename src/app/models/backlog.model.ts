import { UserStory } from "./userStory.model";

export class Backlog{
  _id?:string;
    title?:string;
    description?:string;
    projectID?:string;
  userStoriesId?:UserStory[]

  constructor(    
    _id:string,
    title:string,
    description:string,
    projectID:string,
  userStoriesId:UserStory[]){
    this._id=_id;
    this.title = title;
    this.description = description;
    this.projectID = projectID;
    this.userStoriesId=userStoriesId

  }

}