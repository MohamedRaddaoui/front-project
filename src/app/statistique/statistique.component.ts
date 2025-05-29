import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../services/statistics.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistique',
  templateUrl: './statistique.component.html',
  styleUrls: ['./statistique.component.css']
})
export class StatistiquesComponent implements OnInit {
  stats: any;
  
  // Données pour les graphiques
  projectStatusData = [
    { name: 'Actifs', value: 0, color: '#10B981' },
    { name: 'En attente', value: 0, color: '#F59E0B' },
    { name: 'Archivés', value: 0, color: '#EF4444' }
  ];

  engagementData = [
    { month: 'Jan', tasks: 45, projects: 12 },
    { month: 'Fév', tasks: 52, projects: 15 },
    { month: 'Mar', tasks: 48, projects: 18 },
    { month: 'Avr', tasks: 61, projects: 22 },
    { month: 'Mai', tasks: 55, projects: 25 },
    { month: 'Juin', tasks: 67, projects: 28 }
  ];

  recentActivities = [
    { type: 'Projet', name: 'Site E-commerce', status: 'Actif', date: '2024-05-27' },
    { type: 'Tâche', name: 'Design UI/UX', status: 'En cours', date: '2024-05-26' },
    { type: 'Projet', name: 'App Mobile', status: 'En attente', date: '2024-05-25' }
  ];

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.statisticsService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.updateChartData();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des stats', err);
        // Données de démonstration en cas d'erreur
        this.stats = {
          totalProjects: 45,
          activeProjects: 28,
          archivedProjects: 12,
          pendingProjects: 5,
          totalTasks: 156,
          completedTasks: 98,
          users: {
            admin: 3,
            manager: 8,
            user: 24
          }
        };
        this.updateChartData();
      }
    });
  }

  updateChartData(): void {
    if (this.stats) {
      this.projectStatusData = [
        { name: 'Actifs', value: this.stats.activeProjects || 0, color: '#10B981' },
        { name: 'En attente', value: this.stats.pendingProjects || 0, color: '#F59E0B' },
        { name: 'Archivés', value: this.stats.archivedProjects || 0, color: '#EF4444' }
      ];
    }
  }

  getCompletionRate(): number {
    if (!this.stats || !this.stats.totalTasks) return 0;
    return Math.round((this.stats.completedTasks / this.stats.totalTasks) * 100);
  }

  getActiveRate(): number {
    if (!this.stats || !this.stats.totalProjects) return 0;
    return Math.round((this.stats.activeProjects / this.stats.totalProjects) * 100);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}