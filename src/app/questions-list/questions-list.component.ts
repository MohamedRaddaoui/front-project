import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Question } from '../models/qa.models';
import { QAService } from '../services/qa.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-questions-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './questions-list.component.html',
  styleUrl: './questions-list.component.css'
})
export class QuestionsListComponent  {
  questions: Question[] = [];
  sortBy: string = 'newest';
  searchQuery: string = '';
  searchTags: string = '';
  isAdvancedSearch: boolean = false;
  authorId: string = '';
  startDate: string = '';
  endDate: string = '';

  constructor(
    private qaService: QAService,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  }

  

