import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';

@Component({
  selector: 'app-product-owner',
  imports: [CommonModule,SideBarComponent],
  templateUrl: './product-owner.component.html',
  styleUrl: './product-owner.component.css'
})
export class ProductOwnerComponent {

}
