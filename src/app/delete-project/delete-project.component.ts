import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-project',
  imports: [CommonModule],
  templateUrl: './delete-project.component.html',
  styleUrl: './delete-project.component.css'
})
export class DeleteProjectComponent {

  constructor(private route:ActivatedRoute,private projectService: ProjectService, private router: Router) { }

    @Input() visible = false;
  @Input() title = 'Are you sure?';
  @Input() message = 'This action cannot be undone.';
  @Input() confirmLabel = 'Confirm';
  @Input() cancelLabel = 'Cancel';

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  confirm() {
    this.onConfirm.emit();
  }

  close() {
    this.onCancel.emit();
  }


}



  
   