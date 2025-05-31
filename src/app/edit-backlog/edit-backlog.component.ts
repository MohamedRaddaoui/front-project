import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs'; // *** RÉIMPORTÉ: Nécessaire pour forkJoin et of ***
import { catchError } from 'rxjs/operators'; // *** RÉIMPORTÉ: Nécessaire pour catchError ***
import { ProjectService } from '../services/project.service';
import { UserService } from '../services/user.service'; // *** NÉCESSAIRE: Pour appeler getUserById ***
import { Backlog } from '../models/backlog.model';
import { UserStory } from '../models/userStory.model';
import { Project } from '../models/project.model';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { DeleteProjectComponent } from '../delete-project/delete-project.component';

// Interface User (inchangée, utilise 'string')
interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
}

@Component({
  selector: 'app-edit-backlog',
  templateUrl: './edit-backlog.component.html',
  styleUrls: ['./edit-backlog.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SideBarComponent, NavBarComponent, DeleteProjectComponent]
})
export class EditBacklogComponent implements OnInit {
  backlog: Backlog | null = null;
  backlogId: string = '';
  projectId: string = '';
  projects: Project[] = [];
  userStories: UserStory[] = [];
  selectedStoryIndex: number | null = null;
  showStoryModal: boolean = false;
  editingStoryIndex: number | null = null;
  availableUsers: User[] = []; // Sera peuplée par les appels API
  showAssignModal: boolean = false;
  currentStoryIndexForAssignment: number | null = null;
  currentlyAssignedUserId: string | null | undefined = null;

  showDeleteConfirmation: boolean = false;
  storyToDeleteIndex: number | null = null;
  deleteConfirmationTitle: string = 'Confirmer la suppression';
  deleteConfirmationMessage: string = 'Êtes-vous sûr de vouloir supprimer cette user story ? Cette action est irréversible.';

  backlogForm: FormGroup;
  storyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private userService: UserService, // Injection confirmée comme nécessaire
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.backlogForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      projectID: [null, Validators.required],
    });

    this.storyForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      storyPoints: [0],
      status: ['To Do'],
      backlogID: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.backlogId = params['id'];
      if (this.backlogId) {
        console.log(`[DEBUG] Chargement du backlog avec ID: ${this.backlogId}`);
        this.loadBacklogData();
      }
    });

    this.projectService.getAllProject().subscribe(
      projects => {
        this.projects = projects;
      },
      error => {
        console.error('Erreur lors du chargement des projets:', error);
      }
    );
  }

  loadBacklogData(): void {
    console.log(`[DEBUG] Appel de projectService.getBacklogByID(${this.backlogId})`);
    this.projectService.getBacklogByID(this.backlogId).subscribe(
      backlog => {
        console.log('[DEBUG] Réponse reçue de getBacklogByID:', backlog);
        this.backlog = backlog;
        console.log('[DEBUG] Contenu de backlog.projectID:', backlog.projectID);

        if (backlog.projectID && backlog.projectID._id) {
          console.log(`[DEBUG] projectID trouvé: ${backlog.projectID._id}. Appel de loadProjectUsers.`);
          this.projectId = backlog.projectID._id;
          this.backlogForm.patchValue({
            title: backlog.title,
            description: backlog.description,
            projectID: backlog.projectID,
          });
          // *** MODIFICATION: Passer l'objet projet complet ***
          this.loadProjectUsers(backlog.projectID);
        } else {
          console.error('[DEBUG] ProjectID manquant ou incomplet dans les données du backlog. Objet backlog reçu:', backlog);
          this.availableUsers = [];
        }
        this.loadUserStories();
      },
      error => {
        console.error('Erreur lors du chargement du backlog:', error);
      }
    );
  }

  // *** MÉTHODE CORRIGÉE: Récupère les utilisateurs via API à partir des IDs ***
  loadProjectUsers(project: Project): void {
    console.log('[DEBUG] Appel de loadProjectUsers avec le projet:', project);
    console.log('[DEBUG] Contenu de project.usersID avant la condition:', project?.usersID);

    // Vérifier si project.usersID est un tableau d'IDs (strings)
    if (!project || !project.usersID || !Array.isArray(project.usersID) || project.usersID.length === 0) {
      console.warn('[DEBUG] project.usersID est manquant, non-tableau ou vide. Aucun utilisateur à charger.');
      this.availableUsers = [];
      return;
    }

    // Vérifier si le premier élément est bien un ID (string)
    if (typeof project.usersID[0] !== 'string') {
        console.warn('[DEBUG] project.usersID ne semble pas contenir des IDs (strings). Contenu:', project.usersID);
        this.availableUsers = [];
        return;
    }

    // Créer un tableau d'Observables pour chaque appel à getUserById
    const userObservables = project.usersID.map(userId =>
      this.userService.getUserById(userId as any) // *** AJOUT: Cast explicite en string ***
        .pipe(
          catchError(err => {
            console.error(`[DEBUG] Erreur lors du chargement des détails de l'utilisateur ${userId}:`, err);
            return of(null); // Retourner null en cas d'erreur pour cet utilisateur
          })
        )
    );

    console.log(`[DEBUG] Lancement de ${userObservables.length} appels API pour récupérer les utilisateurs...`);

    // Utiliser forkJoin pour exécuter tous les appels en parallèle
    forkJoin(userObservables).subscribe(users => {
      // Filtrer les résultats null (dus aux erreurs) et s'assurer que ce sont bien des objets User
      // Le cast 'as User[]' suppose que l'API retourne bien des objets conformes à l'interface User
      this.availableUsers = users.filter(user => user !== null) as User[];
      console.log('[DEBUG] Contenu de this.availableUsers après chargement API:', this.availableUsers);

      // Vérifier si l'utilisateur actuellement assigné existe toujours dans la nouvelle liste
      if (this.currentlyAssignedUserId && !this.getUserById(this.currentlyAssignedUserId)) {
          console.warn('L\'utilisateur précédemment assigné ne fait plus partie des utilisateurs disponibles pour ce projet.');
      }
    });
  }

  loadUserStories(): void {
    if (this.backlogId) {
      this.projectService.getUserStoryByBacklog(this.backlogId).subscribe(
        stories => {
          this.userStories = stories;
        },
        error => {
          console.error('Erreur lors du chargement des user stories:', error);
        }
      );
    }
  }

  saveBacklog(): void {
    if (this.backlogForm.valid && this.backlogId) {
      const backlogData: Partial<Backlog> = {
        title: this.backlogForm.value.title,
        description: this.backlogForm.value.description,
        projectID: this.backlogForm.value.projectID._id,
      };
      this.projectService.updateBacklog(this.backlogId, backlogData).subscribe(
        response => {
          console.log('Backlog mis à jour avec succès:', response);
          this.router.navigate(['/backlogDtails', this.backlogId]);
        },
        error => {
          console.error('Erreur lors de la mise à jour du backlog:', error);
        }
      );
    }
  }

  cancelEdit(): void {
    if (this.backlogId) {
      this.router.navigate(['/backlogs', this.backlogId]);
    } else {
      this.router.navigate(['/backlogs']);
    }
  }

  openAddStoryModal(): void {
    this.editingStoryIndex = null;
    this.storyForm.reset({
      title: '',
      description: '',
      storyPoints: 0,
      status: 'To Do',
      backlogID: this.backlogId
    });
    this.showStoryModal = true;
  }

  editStory(index: number, event: Event): void {
    event.stopPropagation();
    this.editingStoryIndex = index;
    const story = this.userStories[index];
    this.storyForm.patchValue({
      title: story.title,
      description: story.description,
      storyPoints: story.storyPoints || 0,
      status: story.status || 'To Do',
      backlogID: this.backlogId
    });
    this.showStoryModal = true;
  }

  closeStoryModal(): void {
    this.showStoryModal = false;
    this.editingStoryIndex = null;
  }

  saveStory(): void {
    if (this.storyForm.valid) {
      const storyData: Partial<UserStory> = {
        title: this.storyForm.value.title,
        description: this.storyForm.value.description,
        storyPoints: this.storyForm.value.storyPoints,
        status: this.storyForm.value.status,
        backlogID: this.backlogId
      };

      if (this.editingStoryIndex !== null) {
        const storyId = this.userStories[this.editingStoryIndex]._id;
        if (storyId) {
          this.projectService.updateUserStory(storyId, storyData).subscribe(
            updatedStory => {
              console.log('User story mise à jour:', updatedStory);
              const currentStory = this.userStories[this.editingStoryIndex!];
              this.userStories[this.editingStoryIndex!] = { ...currentStory, ...storyData, _id: storyId };
              this.closeStoryModal();
            },
            error => {
              console.error('Erreur lors de la mise à jour de la user story:', error);
            }
          );
        }
      } else {
        this.projectService.createUserStory(storyData).subscribe(
          response => {
            console.log('User story créée:', response);
            let newStoryToAdd: UserStory | undefined;
            if (Array.isArray(response) && response.length > 0) {
              newStoryToAdd = response[0];
            } else if (response && typeof response === 'object' && !Array.isArray(response)) {
               newStoryToAdd = (response as any).story || response;
            }

            if (newStoryToAdd && newStoryToAdd._id) {
                 this.userStories.push(newStoryToAdd);
            } else {
                 console.error('Réponse inattendue de createUserStory:', response);
                 this.loadUserStories();
            }
            this.closeStoryModal();
          },
          error => {
            console.error('Erreur lors de la création de la user story:', error);
          }
        );
      }
    }
  }

  removeStory(index: number, event: Event): void {
    event.stopPropagation();
    this.storyToDeleteIndex = index;
    this.showDeleteConfirmation = true;
  }

  confirmDeleteStory(): void {
    if (this.storyToDeleteIndex !== null) {
      const storyId = this.userStories[this.storyToDeleteIndex]._id;
      if (storyId) {
        this.projectService.deleteUserStory(storyId).subscribe({
          next: (response) => {
            console.log('User story supprimée avec succès:', response);
            if (this.storyToDeleteIndex !== null) {
              this.userStories.splice(this.storyToDeleteIndex, 1);
            }
            this.resetDeleteState();
          },
          error: (error) => {
            console.error('Erreur lors de la suppression de la user story:', error);
            this.resetDeleteState();
          }
        });
      } else {
        console.error('ID de la story non trouvé pour la suppression.');
        this.resetDeleteState();
      }
    } else {
      this.resetDeleteState();
    }
  }

  cancelDeleteStory(): void {
    this.resetDeleteState();
  }

  private resetDeleteState(): void {
    this.showDeleteConfirmation = false;
    this.storyToDeleteIndex = null;
  }

  openAssignUserModal(storyIndex: number, event: Event): void {
    event.stopPropagation();
    // Le console.warn est déjà présent ici si la liste est vide
    if (this.availableUsers.length === 0) {
        console.warn("[DEBUG] La liste des utilisateurs disponibles est vide lors de l'ouverture de la modale. Vérifiez le chargement initial et les logs précédents.");
    }
    this.currentStoryIndexForAssignment = storyIndex;
    const story = this.userStories[storyIndex];
    this.currentlyAssignedUserId = story.assignedTo;
    this.showAssignModal = true;
  }

  closeAssignModal(): void {
    this.showAssignModal = false;
    this.currentStoryIndexForAssignment = null;
    this.currentlyAssignedUserId = null;
  }

  // *** CORRECTION: Utilise la méthode dédiée du service ***
  assignUser(userIdToAssign: string): void {
    if (this.currentStoryIndexForAssignment !== null) {
      const storyIndex = this.currentStoryIndexForAssignment;
      const storyId = this.userStories[storyIndex]._id;
      if (storyId) {
        // *** APPEL À LA MÉTHODE DÉDIÉE DU SERVICE ***
        this.projectService.assignUserToStory(storyId, userIdToAssign).subscribe({
          next: (updatedStory) => {
            console.log('Utilisateur assigné avec succès (via service dédié):', updatedStory);
            // Mise à jour locale
            this.userStories[storyIndex].assignedTo = userIdToAssign;
            this.currentlyAssignedUserId = userIdToAssign;
          },
          error: (error) => {
            console.error("Erreur lors de l'assignation de l'utilisateur (via service dédié):", error);
          }
        });
      }
    }
  }

  // *** CORRECTION: Utilise la méthode dédiée du service ***
  unassignUser(): void {
    if (this.currentStoryIndexForAssignment !== null && this.currentlyAssignedUserId) {
      const storyIndex = this.currentStoryIndexForAssignment;
      const storyId = this.userStories[storyIndex]._id;
      if (storyId) {
        // *** APPEL À LA MÉTHODE DÉDIÉE DU SERVICE ***
        this.projectService.unassignUserFromStory(storyId).subscribe({
          next: (updatedStory) => {
            console.log('Utilisateur désassigné avec succès (via service dédié):', updatedStory);
            // Mise à jour locale
            this.userStories[storyIndex].assignedTo = undefined;
            this.currentlyAssignedUserId = null;
          },
          error: (error) => {
            console.error("Erreur lors de la désassignation de l'utilisateur (via service dédié):", error);
          }
        });
      }
    }
  }

  isCurrentUserAssigned(userId: string): boolean {
    return this.currentlyAssignedUserId === userId;
  }

  // getUserById recherche localement dans availableUsers (inchangé)
  getUserById(userId: string | undefined | null): User | undefined {
    if (!userId) return undefined;
    return this.availableUsers.find(user => user._id === userId);
  }

  // getUserFullName (inchangé)
  getUserFullName(user: User | undefined | null): string {
    if (!user) return 'Utilisateur inconnu';
    return `${user.firstname || ''} ${user.lastname || ''}`.trim();
  }

  // getUserInitial (inchangé)
  getUserInitial(user: User | undefined | null): string {
    if (!user || !user.firstname) return '?';
    return user.firstname.charAt(0).toUpperCase();
  }

  selectStory(index: number): void {
    this.selectedStoryIndex = index;
  }

  getTotalPoints(): number {
    return this.userStories.reduce((total, story) => total + (story.storyPoints || 0), 0);
  }

  getCompletionPercentage(): number {
    const completedStories = this.userStories.filter(story => story.status === 'completed');
    const completedPoints = completedStories.reduce((total, story) => total + (story.storyPoints || 0), 0);
    const totalPoints = this.getTotalPoints();
    return totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;
  }
}

