import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { BacklogComponent } from '../backlog/backlog.component';
import { SprintComponent } from '../sprint/sprint.component';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Backlog } from '../models/backlog.model';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { UserStory } from '../models/userStory.model';
import { Sprint } from '../models/sprint.model';
import { CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Project } from '../models/project.model';
import { DeleteProjectComponent } from '../delete-project/delete-project.component';
import { title } from 'process';

@Component({
  selector: 'app-product-owner',
  // standalone: true, // Assurez-vous que c'est bien standalone si votre projet l'utilise
  imports: [CommonModule, SideBarComponent, NavBarComponent, BacklogComponent, SprintComponent,DeleteProjectComponent, ReactiveFormsModule, FormsModule, DragDropModule,RouterLink],
  templateUrl: './product-owner.component.html',
  styleUrls: ['./product-owner.component.css'] // Correction: styleUrls au pluriel
})
export class ProductOwnerComponent implements OnInit, AfterViewInit {
  constructor(private projectService: ProjectService, private route: ActivatedRoute,private router:Router
    , private cdRef: ChangeDetectorRef
  ) {}

   validStoryPoints: number[] = [0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100];

  trackByStoryId(index: number, item: UserStory): string {
    return item?._id || `story-${index}`;
  }
  
  @ViewChildren(CdkDropList) dropLists!: QueryList<CdkDropList>;
  sprintLists: CdkDropList[] = [];

  modalVisible = false;
  modalSprintVisible = false;
  id!: string; // ID du projet
  backlog: Backlog[] = [];
  sprints: Sprint[] = [];
  // backlogID n'est plus nécessaire ici, géré par le formulaire
  project!:Project;

  fromUserStory = new FormGroup({
    title: new FormControl('',[Validators.required]), // Initialiser
    description: new FormControl('',[Validators.required,Validators.pattern(/^\s*En tant que\s+.*/i)]),
    priority: new FormControl('Medium'), // Valeur par défaut
    storyPoints: new FormControl<number | null>(null, [this.allowedValueValidator(this.validStoryPoints) // Validateur personnalisé
      ]),
    backlogID: new FormControl<string | null>(null), // Type explicite
  });

  openModal() {
    this.modalVisible = true;
    this.cdRef.detectChanges();
  }

  closeModal() {
    this.modalVisible = false;
    this.cdRef.detectChanges();
  }

  openModalSprint() {
    this.modalSprintVisible = true;
    this.cdRef.detectChanges();
  }

  closeModalSprint() {
    this.modalSprintVisible = false;
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    if (this.id) {
      this.projectService.getByIdProject(this.id).subscribe((data: Project) => {
        this.project = data;
      });
      this.loadBacklogs();
      this.loadSprints();
    } else {
        console.error("ProductOwnerComponent: Project ID manquant dans la route.");
    }
  }

  loadBacklogs() {
    if (!this.id) return;
    this.projectService.getBacklogByProject(this.id).subscribe((backlogs: Backlog[]) => {
      // Assurer que userStoriesId est toujours un tableau
      this.backlog = backlogs.map(b => ({ ...b, userStoriesId: b.userStoriesId || [] }));
      console.log('Backlogs récupérés:', this.backlog);
      const defaultBacklogId = (this.backlog.length === 1 && this.backlog[0]._id) ? this.backlog[0]._id : null;
      this.fromUserStory.patchValue({ backlogID: defaultBacklogId });
      this.updateDropLists(); // Mettre à jour les connexions après chargement
    });
  }

  loadSprints() {
    if (!this.id) return;
    this.projectService.getSprintByProject(this.id).subscribe((sprints: Sprint[]) => {
      // Assurer que userStories est toujours un tableau
      this.sprints = sprints.map(s => ({ ...s, userStories: s.userStories || [] }));
      console.log('Sprints récupérés:', this.sprints);
      this.updateDropLists(); // Mettre à jour les connexions après chargement
    });
  }

  ngAfterViewInit() {
    this.updateDropLists();
    // Écouter les changements si de nouvelles listes sont ajoutées dynamiquement
    this.dropLists.changes.subscribe(() => this.updateDropLists());
  }

  updateDropLists() {
    // Utiliser setTimeout pour s'assurer que le DOM est prêt
    setTimeout(() => {
      if (this.dropLists) {
        const allLists = this.dropLists.toArray();
        const backlogDropLists = allLists.filter(list => list.id?.startsWith('backlog-list-'));
        const sprintDropLists = allLists.filter(list => list.id?.startsWith('sprint-'));

        // Connecter chaque backlog à tous les sprints
        backlogDropLists.forEach(backlogList => {
          backlogList.connectedTo = sprintDropLists;
        });

        // Connecter chaque sprint à tous les backlogs
        sprintDropLists.forEach(sprintList => {
          sprintList.connectedTo = backlogDropLists;
        });

        console.log('Drop lists connectées.');
        this.sprintLists = sprintDropLists; // Garder une référence si utile
        this.cdRef.detectChanges(); // Important pour que les connexions soient prises en compte
      }
    }, 0);
  }

  // Méthode pour obtenir toutes les user stories du backlog (peut-être plus nécessaire si géré dans le template)
  getBacklogUserStories(): UserStory[] {
    // Attention: cette fonction suppose un seul backlog principal, à adapter si plusieurs backlogs.
    if (!this.backlog || this.backlog.length === 0) return [];
    return this.backlog[0].userStoriesId || [];
  }

  // *** MÉTHODE DROP SIMPLIFIÉE ***
  // *** MÉTHODE DROP SIMPLIFIÉE ***
  // *** MÉTHODE DROP SIMPLIFIÉE ***
  drop(event: CdkDragDrop<UserStory[]>) {
    if (event.previousContainer === event.container) {
      // ... (réorganisation)
    } else {
      // --- Transfert --- 
      transferArrayItem(
        event.previousContainer.data, 
        event.container.data,       
        event.previousIndex,        
        event.currentIndex          
      );

      const userStory = event.container.data[event.currentIndex]; 
      const previousContainerId = event.previousContainer.id;
      const targetContainerId = event.container.id;

      if (!userStory?._id) { /* ... gestion erreur ... */ return; }

      // ---> SI ON DÉPLACE VERS UN SPRINT (Backlog -> Sprint) <--- 
      if (targetContainerId.startsWith("sprint-")) {
          const sprintId = targetContainerId.replace("sprint-", "");
          const backlogIndex = parseInt(previousContainerId.replace("backlog-list-", ""), 10);
          const backlogId = this.backlog[backlogIndex]?._id;
          if (backlogId) {
              console.log(`INFO BACKEND: Story ${userStory._id} de Backlog ${backlogId} vers Sprint ${sprintId}`);
              
              // 1. Ajouter au sprint (Utilise addUserStoryToSprint)
              this.projectService.addUserStoryToSprint(userStory._id, sprintId).subscribe({ /* ... */ });
              
              // 2. Retirer du backlog (Utilise removeFromBacklog)
              // Note: removeFromBacklog ne prend que userStoryId, assurez-vous que le backend sait de quel backlog retirer.
              this.projectService.removeFromBacklog(userStory._id).subscribe({ /* ... */ }); 
          }
      // ---> SI ON DÉPLACE VERS UN BACKLOG (Sprint -> Backlog) <--- 
      } else if (targetContainerId.startsWith("backlog-list-")) {
          const sprintId = previousContainerId.replace("sprint-", "");
          const backlogIndex = parseInt(targetContainerId.replace("backlog-list-", ""), 10);
          const backlogId = this.backlog[backlogIndex]?._id;
          if (backlogId) {
              console.log(`INFO BACKEND: Story ${userStory._id} de Sprint ${sprintId} vers Backlog ${backlogId}`);
              
              // *** CORRECTION ICI ***
              // 1. Retirer du sprint (Utilise removeUserStoryFromSprint)
              this.projectService.removeUserStoryFromSprintEX(userStory._id, userStory).subscribe({ 
                  next: () => console.log(`Serveur OK: Story ${userStory._id} retirée de Sprint ${sprintId}`),
                  error: (err) => {
                      console.error("Erreur serveur retrait sprint:", err);
                      alert("Erreur serveur: Le retrait du sprint a échoué.");
                  }
              }); 
              
              // 2. Ajouter au backlog (Utilise addToBacklog)
              this.projectService.addToBacklog(userStory._id, backlogId).subscribe({ 
                  next: () => console.log(`Serveur OK: Story ${userStory._id} ajoutée à Backlog ${backlogId}`),
                  error: (err) => {
                      console.error("Erreur serveur ajout backlog:", err);
                      alert("Erreur serveur: L'ajout au backlog a échoué.");
                  }
              });
          }
      }
    }
  }




  // Méthode pour ajouter une user story à un sprint (appelée depuis drop)
  // Cette méthode est maintenant juste un exemple d'appel serveur *après* le drop.
  addUserStoryToSprint(userStory: UserStory, sprintId: string) {
    if (!userStory._id) {
      console.error('User story ID is undefined');
      return;
    }
    // Note: Cet appel se fait APRES le déplacement visuel.
    this.projectService.addUserStoryToSprint(userStory._id, sprintId).subscribe({
      next: (response) => {
        console.log(`Serveur: Story ${userStory._id} ajoutée au sprint ${sprintId} (réponse: ${response})`);
      },
      error: (err) => {
        console.error(`Erreur serveur lors de l'ajout de ${userStory._id} au sprint ${sprintId}:`, err);
        // Ici, vous pourriez vouloir implémenter une logique pour annuler
        // le déplacement visuel si l'appel serveur échoue, ou au moins notifier l'utilisateur.
      }
    });
  }

  addUserStory() {
    let userStoryData = this.fromUserStory.value;

    // Validation simple
    if (!userStoryData.title || !userStoryData.backlogID) {
        alert('Veuillez renseigner le titre et sélectionner un backlog.');
        return;
    }

    console.log('Sending user story data:', userStoryData);

    this.projectService.createUserStory(userStoryData as UserStory).subscribe({ // Cast si sûr du type
      next: (response) => {
        console.log('User story successfully added:', response);
        this.fromUserStory.reset({ priority: 'Medium', backlogID: (this.backlog.length === 1 ? this.backlog[0]._id : null) });
        // Recharger seulement le backlog où la story a été ajoutée
        this.loadBacklogs(); // Ou une méthode plus ciblée si possible
      },
      error: (err) => {
        console.error('Error while adding user story:', err);
        alert('Failed to add user story. Please check the console.');
      }
    });
  }

  // Méthode pour obtenir les IDs des listes connectées (utilisée dans le template)
  getConnectedDropListsIds(currentListId: string): string[] {
      if (!this.dropLists) return [];
      const allListIds = this.dropLists.map(list => list.id).filter(id => !!id) as string[];
      if (currentListId.startsWith('backlog-list-')) {
          return allListIds.filter(id => id.startsWith('sprint-'));
      } else if (currentListId.startsWith('sprint-')) {
          return allListIds.filter(id => id.startsWith('backlog-list-'));
      }
      return [];
  }

  // Fonctions trackBy pour ngFor
  trackByFn(index: number, item: UserStory): string {
    return item?._id || `story-${index}`;
  }
  trackByBacklogId(index: number, item: Backlog): string {
    return item?._id || `backlog-${index}`;
  }
   trackBySprintId(index: number, item: Sprint): string {
    return item?._id || `sprint-${index}`;
  }

  // --- Gestion Menu Contextuel --- 
  activeMenu: { listId: string, storyId: string } | null = null;

  toggleStoryMenu(listId: string, storyId: string, event: MouseEvent) {
    event.stopPropagation();
    const menuKey = `${listId}-${storyId}`;
    if (this.activeMenu?.listId === listId && this.activeMenu?.storyId === storyId) {
      this.activeMenu = null;
    } else {
      this.activeMenu = { listId, storyId };
    }
     this.cdRef.detectChanges();
  }

  isMenuOpen(listId: string, storyId: string): boolean {
    return this.activeMenu?.listId === listId && this.activeMenu?.storyId === storyId;
  }

  @HostListener('document:click', ['$event'])
  closeMenuOnOutsideClick(event: MouseEvent) {
    if (this.activeMenu) {
      const clickedElement = event.target as HTMLElement;
      if (!clickedElement.closest('.story-menu-container.menu-open')) {
         this.activeMenu = null;
         this.cdRef.detectChanges();
      }
    }
  }

  // Actions du menu (signatures corrigées si besoin)
  showStoryDetails(story: UserStory) {
    console.log('Voir détails:', story);
    alert(`Détails de: ${story.title}`);
    this.activeMenu = null;
  }

  editStory(story: UserStory) {
    console.log('Modifier:', story);
    alert(`Modifier: ${story.title}`);
    this.activeMenu = null;
  }

  deleteStory(story: UserStory, listId: string) {
    console.log('Supprimer:', story, 'from list:', listId);
    if (!story._id) return;
    if (confirm(`Êtes-vous sûr de vouloir supprimer la user story "${story.title}" ?`)) {
      // Logique de suppression serveur à implémenter ici
      // Exemple:
      // if (listId.startsWith('backlog-list-')) { ... this.projectService.deleteUserStoryFromBacklog(...).subscribe(...); }
      // else if (listId.startsWith('sprint-')) { ... this.projectService.deleteUserStoryFromSprint(...).subscribe(...); }
      alert('Logique de suppression serveur à implémenter !');
    }
    this.activeMenu = null;
  }

  addUserToStory(story: UserStory) {
    console.log('Ajouter utilisateur:', story);
    alert(`Ajouter utilisateur à: ${story.title}`);
    this.activeMenu = null;
  }

  removeUserFromStory(story: UserStory) {
    console.log('Retirer utilisateur:', story);
    alert(`Retirer utilisateur de: ${story.title}`);
    this.activeMenu = null;
  }

  // --- Gestion Suppression Backlog --- 
  popupVisible = false;
  backlogIdToDelete: string | null = null; // Renommé pour clarté
  sprintToDelete: string | null = null;

  openPopup(backlogID: string): void {
    this.backlogIdToDelete = backlogID;
    this.popupVisible = true;
  }

  cancelDelete() {
    this.popupVisible = false;
    this.backlogIdToDelete = null;
  }

  confirmDelete(): void {
    if (this.backlogIdToDelete) {
      console.log('ID du backlog à supprimer :', this.backlogIdToDelete);
      this.projectService.deleteBacklog(this.backlogIdToDelete).subscribe({
        next: (res:any) => {
          console.log("Suppression confirmée :", res.message);
          this.backlog = this.backlog.filter(b => b._id !== this.backlogIdToDelete);
          this.popupVisible = false;
          this.backlogIdToDelete = null;
          // Optionnel: Afficher une notification
          alert('Backlog supprimé avec succès.');
          // Pas de redirection automatique ici, laisser l'utilisateur sur la page
        },
        error: (err) => {
          console.error('Erreur de suppression du backlog :', err);
          alert('Échec de la suppression du backlog.');
          this.popupVisible = false;
          this.backlogIdToDelete = null;
        }
      });
    } else {
      console.warn('Aucun ID de backlog sélectionné pour suppression');
      this.popupVisible = false;
    }
  }



    confirmDeleteSprint(): void {
    if (this.sprintToDelete) {
      console.log('ID du sprint à supprimer :', this.sprintToDelete);
      this.projectService.deleteSprint(this.sprintToDelete).subscribe({
        next: (res:any) => {
          console.log("Suppression confirmée :", res.message);
          this.backlog = this.backlog.filter(b => b._id !== this.sprintToDelete);
          this.popupVisible = false;
          this.sprintToDelete = null;
          // Optionnel: Afficher une notification
          alert('Backlog supprimé avec succès.');
          // Pas de redirection automatique ici, laisser l'utilisateur sur la page
        },
        error: (err) => {
          console.error('Erreur de suppression du backlog :', err);
          alert('Échec de la suppression du backlog.');
          this.popupVisible = false;
          this.sprintToDelete = null;
        }
      });
    } else {
      console.warn('Aucun ID de backlog sélectionné pour suppression');
      this.popupVisible = false;
    }
  }



  // Fonction de validation personnalisée (peut être mise hors de la classe si elle ne dépend pas de 'this')
 allowedValueValidator(allowedValues: number[]): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === '') {
      return null; // Ne pas valider si le champ est vide (laisser faire Validators.required si besoin)
    }
    const isValueAllowed = allowedValues.includes(Number(control.value));
    return isValueAllowed ? null : { allowedValue: { validValues: allowedValues, actualValue: control.value } };
  };
}



}

