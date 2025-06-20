import { Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WordOfDayComponent } from "./components/word-of-day/word-of-day.component";
import { FooterComponent } from "./components/footer/footer.component";
import { FavoritosComponent } from './components/favoritos/favoritos.component';
import { CommonModule } from '@angular/common';
import { RatingAppComponent } from "./components/rating/rating.component";
import { HeaderComponent } from './components/header/header.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { EnConstruccionComponent } from './components/en-construccion/en-construccion.component';


@Component({
  selector: 'app-root',
  imports: [ 
    WordOfDayComponent,
    FooterComponent, 
    CommonModule, 
    FavoritosComponent, 
    RatingAppComponent, 
    HeaderComponent, 
    RankingComponent,
    EnConstruccionComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  user: SocialUser | null = null;
  isLogged: boolean = false;
  title = 'andalucismo';
  isMobileView: boolean = false;

  
  constructor(private authService: SocialAuthService) {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.isLogged = !!user;
    });

    window.addEventListener('resize', () => {
      this.isMobileView = window.innerWidth <= 750;
    });
  }

  
   ngOnInit(): void {
      this.isMobileView = window.innerWidth <= 750;
  }
  }


