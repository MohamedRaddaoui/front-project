import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/env';
import { map, Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { Backlog } from '../models/backlog.model';
import { UserStory } from '../models/userStory.model';
import { Sprint } from '../models/sprint.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.baseUrl}/project`;
  private apiUrl1 = `${environment.baseUrl}/backlog`;
  private apiUrl2 = `${environment.baseUrl}/userstory`;
  private apiUrl3 =`${environment.baseUrl}/sprint`;

  constructor(private http :HttpClient,private tokenService: TokenService) {}  

     //cerate new project
     addProject(data:Project):Observable<Project[]>{
       const token = this.tokenService.getToken(); // récupère ton token
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
        });
      
      return this.http.post<Project[]>(`${this.apiUrl}/addProject`,data,{ headers });
    }
     getAllProject():Observable<Project[]>{
      return this.http.get<Project[]>(`${this.apiUrl}/listProject`);
     }
      getByIdProject(id: string): Observable<Project> {
        return this.http.get<{ project: Project }>(`${this.apiUrl}/projectByID/${id}`).pipe(
          map(response => response.project) // extraire seulement le projet depuis { project, statusUpdate }
        );
      }
     updateProject(id:String,data:Project):Observable<Project>{
      return this.http.put<Project>(`${this.apiUrl}/updateProject/${id}`, data);
     }

     deleteProject(id:String):Observable<Project[]>{
      return this.http.delete<Project[]>(`${this.apiUrl}/deleteProject/${id}`);
     }
     
     assignUserToProject(data: { projectId: string, email: string, userType: string }):Observable<Project[]>{
       console.log("URL utilisée :", `${this.apiUrl}/assignUserToProject`);
  console.log("Données envoyées :", data); 
      return this.http.post<Project[]>(`${this.apiUrl}/assignUserToProject`,data);
     }
     
     unassignUser(projectId:String,userId:String):Observable<Project[]>{
      return this.http.delete<Project[]>(`${this.apiUrl}/removeMember/${projectId}/${userId}`);
     }
     
     archiveProject(id:String, data:Project):Observable<Project[]>{
      return this.http.put<Project[]>(`${this.apiUrl}/archiveProject/${id}`,data);
     }
     restoreProject(id:String, data:Project):Observable<Project[]>{
      return this.http.put<Project[]>(`${this.apiUrl}/restoreProject/${id}`,data);
     }

     listOfArchiveProject():Observable<Project[]>{
      return this.http.get<Project[]>(`${this.apiUrl}/getArchProject`);  
    }


      ArchiveProjectByUser():Observable<Project[]>{
      return this.http.get<Project[]>(`${this.apiUrl}/getArchProjectUser`);  
    }


    getProjectByUser(id:String):Observable<Project[]>{
      return this.http.get<Project[]>(`${this.apiUrl}/getProjectByUser/${id}`);  
    }

    DeleteTaskByProject(id:String):Observable<Project[]>{
      return this.http.get<Project[]>(`${this.apiUrl}/DeleteTaskByProject/${id}`);  
    }
    calculateProgress(id:String):Observable<Project[]>{
      return this.http.get<Project[]>(`${this.apiUrl}/calculateProgress/${id}`);  
    }
    summaryTask(id:String):Observable<Project[]>{
      return this.http.get<Project[]>(`${this.apiUrl}/sumTask/${id}`);  
    }
    search():Observable<Project[]>{
      return this.http.get<Project[]>(`${this.apiUrl}/search`);  
    }
// router.get('/checkProjectOverdue/:id',projectCtrl.checkProjectOverdue)



//partie pour les projets de type scrum 

//gestion backlog 

  //cerate new project
     createBacklog(id: string,data:Backlog):Observable<Backlog[]>{
      return this.http.post<Backlog[]>(`${this.apiUrl1}/createBacklog/${id}`,data);
    }

  //show all backlog 
  getAllBacklog():Observable<Backlog[]>{
    return this.http.get<Backlog[]>(`${this.apiUrl1}/getAllBacklog`)
  }
  
  //show backlog by id
  getBacklogByID(id:string):Observable<Backlog>{
    return this.http.get<Backlog>(`${this.apiUrl1}/getBacklogById/${id}`)
  }
  //update backlog
  updateBacklog(id:string,data:Backlog):Observable<Backlog[]>{
    return this.http.put<Backlog[]>(`${this.apiUrl1}/updateBacklog/${id}`,data)
  }
  //delete backlog
  deleteBacklog(id:string):Observable<Backlog>{
    return this.http.delete<Backlog>(`${this.apiUrl1}/deleteBacklog/${id}`)
    
  }

  getBacklogByProject(id:string):Observable<Backlog[]>{
    return this.http.get<Backlog[]>(`${this.apiUrl1}/getBacklogByProject/${id}`)

  }


// UserStory
createUserStory(data:UserStory):Observable<UserStory[]>{
  return this.http.post<UserStory[]>(`${this.apiUrl2}/createUserStory`,data)
}
getUserStoryByBacklog(id:string):Observable<UserStory[]>{
  return this.http.get<UserStory[]>(`${this.apiUrl2}/getUserStoryByBacklog/${id}`)
}
getUserStoriesBySprint(id:string):Observable<UserStory[]>{
  return this.http.get<UserStory[]>(`${this.apiUrl2}/userStoryBySprint/${id}`)
}
removeUserStoryFromSprint(id:string,data:UserStory):Observable<UserStory>{
  return this.http.put<UserStory>(`${this.apiUrl2}/removeUserStory/${id}`,data)
}

removeUserStoryFromSprintEX(id:string,data:UserStory):Observable<UserStory>{
  return this.http.put<UserStory>(`${this.apiUrl2}/removeUserStoryFromSprintEX/${id}`,data)
}
updateUserStory(id:string,data:UserStory):Observable<UserStory>{
  return this.http.put<UserStory>(`${this.apiUrl2}/updateUserStory/${id}`,data)
}

assignUserToStory(storyId: string, userId: string) {
    return this.http.put(`${this.apiUrl2}/assignUser/${storyId}`, { userId });
  }

unassignUserFromStory(storyId: string) {
  return this.http.put(`${this.apiUrl2}/unassignedUser/${storyId}`, {});
}


deleteUserStory(id:string):Observable<UserStory>{
  return this.http.delete<UserStory>(`${this.apiUrl2}/deleteUserStory/${id}`)
}

 removeFromBacklog(userStoryId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl2}/remove-from-backlog/${userStoryId}`, {});
  }
  addToBacklog(userStoryId: string, backlogId: string): Observable<any> {
  return this.http.post(`${this.apiUrl2}/addUserStoryToBacklog`, {
    userStoryId,
    backlogId
  });
}

//sprint
createSprint(id:string,data:Sprint):Observable<Sprint[]>{
  return this.http.post<Sprint[]>(`${this.apiUrl3}/createSprint/${id}`,data)
}
getSprintByProject(id:string):Observable<Sprint[]>{
  return this.http.get<Sprint[]>(`${this.apiUrl3}/sprintByProject/${id}`)
}
// Dans project.service.ts
addUserStoryToSprint(userStoryId: string, sprintId: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl3}/assignUserStory/${sprintId}/userStories`, { userStoryId });
}

getSprintById(id:string):Observable<Sprint>{
  return this.http.get<Sprint>(`${this.apiUrl3}/sprintById/${id}`);
}


deleteSprint(id:string):Observable<Sprint>{
  return this.http.delete<Sprint>(`${this.apiUrl3}/deleteSprint/${id}`);

}

getProjectTaskSummary(id: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/getProjectTaskSummary/${id}`);
}
checkProjectOverdue(id: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/checkProjectOverdue/${id}`);
}





}