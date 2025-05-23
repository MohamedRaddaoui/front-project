import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDashboardComponent } from './user-dashboard.component';
import { UserService } from '../services/user.service';
import { of, throwError } from 'rxjs';

describe('UserDashboardComponent', () => {
  let component: UserDashboardComponent;
  let fixture: ComponentFixture<UserDashboardComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getAllUsers']);

    await TestBed.configureTestingModule({
      imports: [UserDashboardComponent], // Importe directement le composant standalone
      providers: [
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    const dummyUsers = [
      { firstname: 'John', lastname: 'Doe', email: 'john@example.com', role: 'admin' }
    ];
    mockUserService.getAllUsers.and.returnValue(of(dummyUsers));

    fixture.detectChanges();

    expect(component.users.length).toBe(1);
    expect(component.users).toEqual(dummyUsers);
  });

  it('should handle error when loading users', () => {
    mockUserService.getAllUsers.and.returnValue(throwError(() => new Error('Erreur serveur')));

    fixture.detectChanges();

    expect(component.users.length).toBe(0);
  });
});
