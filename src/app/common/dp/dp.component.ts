import { Component } from '@angular/core';

@Component({
  selector: 'sb-description',
  template: `
    <div class="description">
      <h3>Description</h3>
      <p>This is a reusable description block for the Kanban board.</p>
    </div>
  `,
  standalone: true
})
export class SBDescriptionComponent {}
