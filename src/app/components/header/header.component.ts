import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialUser } from '@abacritt/angularx-social-login';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';



@Component({
  selector: 'app-header',
  imports: [ CommonModule, GoogleSigninButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
signInWithGoogle() {
throw new Error('Method not implemented.');
}
  user: SocialUser | null = null;
  isLogged: boolean = false;

  constructor(private authService: SocialAuthService) {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.isLogged = !!user;
    });
  }

  signOut(): void {
    this.authService.signOut();
  }




}
