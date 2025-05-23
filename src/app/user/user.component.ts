import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ← ajouter CommonModule

@Component({
  selector: 'app-user',
  standalone: true,    // ← standalone
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  imports: [CommonModule]  // ← il faut imports: [CommonModule]
})
export class UserComponent {
  users = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' }
  ];
}
