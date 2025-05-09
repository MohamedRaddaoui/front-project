import { CommonModule } from '@angular/common';
import { Component,OnInit  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent  implements OnInit{
 showAddButton = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.showAddButton = this.router.url.includes('task'); 
    });
  }


}
