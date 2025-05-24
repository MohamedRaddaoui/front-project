import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, HostListener } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { BacklogComponent } from '../backlog/backlog.component';
import { SprintComponent } from '../sprint/sprint.component';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Backlog } from '../models/backlog.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserStory } from '../models/userStory.model';
import { Sprint } from '../models/sprint.model';
import { CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Project } from '../models/project.model';
import { DeleteProjectComponent } from '../delete-project/delete-project.component';

@Component({
  selector: 'app-product-owner',
  imports: [CommonModule, SideBarComponent, NavBarComponent, BacklogComponent, SprintComponent,DeleteProjectComponent, ReactiveFormsModule, FormsModule, DragDropModule],
  templateUrl: './product-owner.component.html',
  styleUrl: './product-owner.component.css'
})
export class ProductOwnerComponent implements OnInit, AfterViewInit {
  constructor(private projectService: ProjectService, private route: ActivatedRoute,private router:Router) {}

  // Référence aux listes de drop pour les connecter
  @ViewChildren(CdkDropList) dropLists!: QueryList<CdkDropList>;
  sprintLists: CdkDropList[] = [];

  modalVisible = false;
  modalSprintVisible = false;
  id!: string;
  backlog: Backlog[] = [];
  sprints: Sprint[] = [];
  backlogID!: string;
  project!:Project;

  fromUserStory = new FormGroup({
    title: new FormControl(),
    description: new FormControl(),
    priority: new FormControl(),
    storyPoints: new FormControl(),
    backlogID: new FormControl(),
  });

  openModal() {
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
  }

  openModalSprint() {
    this.modalSprintVisible = true;
  }

  closeModalSprint() {
    this.modalSprintVisible = false;
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
     
        if (this.id) {
          this.projectService.getByIdProject(this.id).subscribe((data: Project) => {
            this.project = data;
          });
        }

    // Récupère le backlog du projet
    this.projectService.getBacklogByProject(this.id).subscribe((backlogs: Backlog[]) => {
      this.backlog = backlogs;
      console.log('Backlog récupéré:', this.backlog);
      if (this.backlog.length === 1) {
        console.log('ID du backlog unique:', this.backlog[0]._id);
        if (this.backlog[0]._id) {
          this.fromUserStory.patchValue({
            backlogID: this.backlog[0]._id
          });
        }
      }
    });

    // Récupère les sprints liés au projet
  // Récupère les sprints liés au projet
  this.projectService.getSprintByProject(this.id).subscribe((sprints: Sprint[]) => {
    this.sprints = sprints;
    console.log('Sprints récupérés:', this.sprints);
    
    this.sprints.forEach(s => {
      s.userStories = s.userStories || [];
      console.log('Sprint ID:', s._id); // Vérifiez que chaque sprint a un ID
    });
  });

  }

  ngAfterViewInit() {
  // Récupérer toutes les listes de drop après l'initialisation de la vue
  setTimeout(() => {
    this.sprintLists = this.dropLists.toArray().filter(list => list.id?.startsWith('sprint-'));
    console.log('Sprint drop lists:', this.sprintLists);
    console.log('Backlog drop list:', this.dropLists.toArray().find(list => !list.id?.startsWith('sprint-')));
  }, 500);
}

  // Méthode pour obtenir toutes les user stories du backlog
  getBacklogUserStories(): UserStory[] {
    if (!this.backlog || this.backlog.length === 0) return [];
    
    // Si userStoriesId est un tableau d'objets UserStory
    return this.backlog[0].userStoriesId || [];
  }

// Méthode appelée lors du drop d'une user story
// Dans votre méthode drop, ajoutez cette vérification
drop(event: CdkDragDrop<UserStory[]>) {
  if (event.previousContainer === event.container) {
    // Réorganisation dans la même liste
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    // Transfert entre listes
    const userStory = event.previousContainer.data[event.previousIndex];
    
    // Identifier si on déplace vers un sprint
    const targetContainerId = event.container.id;
    if (targetContainerId && targetContainerId.startsWith('sprint-')) {
      const sprintId = targetContainerId.replace('sprint-', '');
      
      // Appel au service pour enregistrer la user story dans le sprint
      if (userStory && userStory._id) {
        this.addUserStoryToSprint(userStory, sprintId);
      }
    }
    
    // Effectuer le déplacement visuel
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );
  }
}




  // Méthode pour ajouter une user story à un sprint
  addUserStoryToSprint(userStory: UserStory, sprintId: string) {
    if (!userStory._id) {
      console.error('User story ID is undefined');
      return;
    }
    
    this.projectService.addUserStoryToSprint(userStory._id, sprintId).subscribe({
      next: (response) => {
        console.log('User story ajoutée au sprint avec succès:', response);
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de la user story au sprint:', err);
      }
    });
  }

  addUserStory() {
    let userStoryData = this.fromUserStory.value;

    // Nettoyage : si backlogID vaut "undefined" (string), on le remet à null ou on prend backlog[0].id
    if (userStoryData.backlogID === 'undefined' || userStoryData.backlogID == null) {
      if (this.backlog.length === 1 && this.backlog[0]._id) {
        userStoryData.backlogID = this.backlog[0]._id;
        this.fromUserStory.patchValue({ backlogID: this.backlog[0]._id });
      } else {
        alert('Please select a valid backlog.');
        return;
      }
    }

    console.log('Sending user story data:', userStoryData);

    this.projectService.createUserStory(userStoryData).subscribe({
      next: (response) => {
        console.log('User story successfully added:', response);
        this.fromUserStory.reset();
      },
      error: (err) => {
        console.error('Error while adding user story:', err);
        alert('Failed to add user story. Please check the console.');
      }
    });
  }
// Méthode pour obtenir les IDs des listes de sprint
getBacklogListIds(): string[] {
  // Retourne un tableau avec les IDs de toutes les listes de backlog
  return this.backlog.map((b, index) => 'backlog-list-' + index);
}



  // Fonction pour améliorer les performances de ngFor
// Fonction pour améliorer les performances de ngFor
trackByFn(index: number, item: UserStory): string {
  return item._id || index.toString();
}

// Dans ngAfterViewInit




showStoryOptions(story: UserStory) {
  console.log('Afficher les options pour la story:', story);
  // Vous pouvez ici afficher un menu contextuel ou une boîte de dialogue
  // avec les options : voir détails, modifier, supprimer, ajouter/retirer utilisateur
  
  // Exemple avec une boîte de dialogue de confirmation
  const action = confirm(
    `Options pour "${story.title}":\n\n` +
    `1. Voir les détails\n` +
    `2. Modifier\n` +
    `3. Supprimer\n` +
    `4. Gérer les utilisateurs\n\n` +
    `Que souhaitez-vous faire ?`
  );
  
  if (action) {
    // Implémentez votre logique en fonction de la réponse
  }
}




// Variable pour suivre quel menu est ouvert
activeMenu: { backlogIndex: number, storyIndex: number } | null = null;

// Méthode pour basculer l'affichage du menu
toggleStoryMenu(backlogIndex: number, storyIndex: number) {
  if (this.isMenuOpen(backlogIndex, storyIndex)) {
    // Si le menu est déjà ouvert, le fermer
    this.activeMenu = null;
  } else {
    // Sinon, ouvrir ce menu et fermer tout autre menu ouvert
    this.activeMenu = { backlogIndex, storyIndex };
  }
}

// Méthode pour vérifier si un menu spécifique est ouvert
isMenuOpen(backlogIndex: number, storyIndex: number): boolean {
  return this.activeMenu !== null && 
         this.activeMenu.backlogIndex === backlogIndex && 
         this.activeMenu.storyIndex === storyIndex;
}

// Ajouter un écouteur de clic global pour fermer le menu lorsqu'on clique ailleurs
@HostListener('document:click', ['$event'])
closeMenuOnOutsideClick(event: MouseEvent) {
  // Vérifier si le clic est en dehors du menu
  if (this.activeMenu !== null) {
    const clickedElement = event.target as HTMLElement;
    // Si l'élément cliqué n'est pas un élément de menu ou l'icône de menu
    if (!clickedElement.closest('.story-menu-dropdown') && 
        !clickedElement.classList.contains('story-menu-icon')) {
      this.activeMenu = null;
    }
  }
}

// Méthodes pour les actions
showStoryDetails(story: UserStory) {
  console.log('Voir les détails de la story:', story);
  this.activeMenu = null; // Fermer le menu après l'action
  // Implémentez votre logique d'affichage des détails ici
}

editStory(story: UserStory) {
  console.log('Modifier la story:', story);
  this.activeMenu = null; // Fermer le menu après l'action
  // Implémentez votre logique d'édition ici
}

deleteStory(story: UserStory) {
  console.log('Supprimer la story:', story);
  this.activeMenu = null; // Fermer le menu après l'action
  // Implémentez votre logique de suppression ici
}

addUserToStory(story: UserStory) {
  console.log('Ajouter un utilisateur à la story:', story);
  this.activeMenu = null; // Fermer le menu après l'action
  // Implémentez votre logique d'ajout d'utilisateur ici
}

removeUserFromStory(story: UserStory) {
  console.log('Retirer un utilisateur de la story:', story);
  this.activeMenu = null; // Fermer le menu après l'action
  // Implémentez votre logique de retrait d'utilisateur ici
}



//fonction suppresion backlog and userStory
popupVisible = false;

openPopup(backlogID: string): void {
  this.id = backlogID;
  this.popupVisible = true;
}

cancelDelete() {
  this.popupVisible = false;
}

confirmDelete(): void {
  if (this.id) {
    console.log('ID à supprimer :', this.id);

    this.projectService.deleteBacklog(this.id).subscribe({
      next: (res:any) => {
        console.log("Suppression confirmée :", res.message);

        // Si tu as une liste locale de backlogs à mettre à jour :
        this.backlog = this.backlog.filter(b => b._id !== this.id);

        // Redirection optionnelle (à adapter selon ton app)
        this.router.navigate(['/'], {
          queryParams: { message: 'Project deleted successfully' }
        });
      },
      error: (err) => {
        console.error('Erreur de suppression :', err);
        alert('Failed to delete backlog and its user stories.');
      }
    });
  } else {
    console.warn('Aucun ID sélectionné pour suppression');
  }

  this.popupVisible = false;
}






}
