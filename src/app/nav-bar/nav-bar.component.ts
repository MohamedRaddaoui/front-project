import { CommonModule } from '@angular/common';
import { Component,OnInit  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { TokenService } from '../services/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent  implements OnInit{
 showAddButton = false;
  private token: string | null;
  private userId: string | any;
  public user: User | undefined;
  private jwtHelper = new JwtHelperService();

  constructor(private router: Router, private route: ActivatedRoute, private tokenService: TokenService,private userService: UserService) {
        this.token = this.tokenService.getToken();
    if (this.token) {
      const decodedToken = this.jwtHelper.decodeToken(this.token);
      this.userId = decodedToken.userId;
    }
  }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.showAddButton = this.router.url.includes('task'); 
    });
    this.userService.getUserById(this.userId).subscribe((user) => this.user = user)
  }


}
