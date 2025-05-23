import { Component, ElementRef, Input, TemplateRef, ViewChild } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { DeleteProjectComponent } from '../delete-project/delete-project.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { AssignUserComponent } from '../assign-user/assign-user.component';
import { TokenService } from '../services/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ScrumProjectComponent } from '../scrum-project/scrum-project.component';
@Component({
  selector: 'app-standard-project',
  imports: [CommonModule,SideBarComponent, NavBarComponent,DeleteProjectComponent,AssignUserComponent, ReactiveFormsModule,FormsModule,RouterLink],
  templateUrl: './standard-project.component.html',
  styleUrl: './standard-project.component.css'
})
export class StandardProjectComponent {

token:string |null;
userId:string="";
role!:string;
private jwtHelper = new JwtHelperService();
 @Input() customTasksTemplate?: TemplateRef<any>;
  constructor(private projectService:ProjectService,private route: ActivatedRoute,private router:Router,private tokenService: TokenService)
  {
     
    this.token = this.tokenService.getToken();
      if (this.token) {
        const decodedToken = this.jwtHelper.decodeToken(this.token);
        this.userId = decodedToken.userId;
    //       this.role = decodedToken.role;
    //       // Redirection selon le rôle
    // switch (this.role) {
    //   case 'admin':
    //     this.router.navigate(['/']);
    //     break;
    //   case 'manager':
    //     this.router.navigate(['/manager-dashboard']);
    //     break;
    //   case 'user':
    //     this.router.navigate(['/user-dashboard']);
    //     break;
    //   default:
    //     this.router.navigate(['/login']); // ou une page d'erreur
    //     break;
    // }
      }
  }
  

  id!:string

   // Gardez uniquement cette déclaration avec le bon type
  @Input() project!: Project;
  @Input() isScrum: boolean = false;
  ngOnInit(){
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.projectService.getByIdProject(this.id).subscribe((data: Project) => {
        this.project = data;
      });
    }
  
  }


  formatDate(isoDate: String | undefined): string {
    if (!isoDate) return 'Date invalide';
  
    const date = new Date(isoDate.toString()); // <- conversion explicite
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }


  archivedFunction(){
    this.projectService.archiveProject(this.id,this.project).subscribe()
    console.log('archived successful')
    this.router.navigate(['/'], {
      queryParams: { message: 'Project archived successfully' }
    })
  }
  editedProject!: Project;

  isEditing: boolean = false;

  editProject() {
    this.isEditing = true;
    this.editedProject = { ...this.project };
  }

  saveProject() {
    this.projectService.updateProject(this.id, this.editedProject).subscribe({
      next: (updatedProject:Project) => {
        this.project = updatedProject;
        this.isEditing = false;
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour', err);
      }
    });
  }

  cancelEdit() {
    this.isEditing = false;
  }
showAddPopup = false;
  popupPosition = { top: '0px', left: '0px' };

  @ViewChild('addIcon', { static: false }) addIconRef!: ElementRef;

  openAddUserPopup(event: MouseEvent) {
    this.showAddPopup = true;
    const rect = (this.addIconRef.nativeElement as HTMLElement).getBoundingClientRect();
    this.popupPosition = {
      top: `${rect.bottom + window.scrollY}px`,
      left: `${rect.left + window.scrollX}px`
    };
  }

  closeAddUserPopup() {
    this.showAddPopup = false;
  }
  





//fonction de suppression
  popupVisible = false;

openPopup() {
  this.popupVisible = true;
}

cancelDelete() {
  this.popupVisible = false;
}

confirmDelete() {
  if (this.id) {
    this.projectService.deleteProject(this.id).subscribe({
      next: () => {
        console.log("Suppression confirmée");
        this.router.navigate(['/'], {
          queryParams: { message: 'Project deleted successfully' }
        });
      },
      error: (err) => {
        console.error('Erreur de suppression :', err);
      }
    });
  }
  this.popupVisible = false;
}






  
}