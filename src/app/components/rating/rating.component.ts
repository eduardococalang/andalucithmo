import { Component,OnInit, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { collection, doc, getDoc, setDoc, Firestore, onSnapshot } from '@angular/fire/firestore';
import { getAuth, user } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { FormsModule } from '@angular/forms';
import { Rating } from 'primeng/rating';

@Component({
  selector: 'app-rating-app',
  standalone: true,
  imports: [CommonModule, MatButtonModule , FormsModule, Rating],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})

export class RatingAppComponent implements OnInit {

  value!: number;
  rate: number = 0;
  promedio: number = 0;
  votos: number = 0;
  userId: string | null = null;
  user: SocialUser | null = null;
  isLogged: boolean = false;
  hasRated: boolean = false;


  constructor(
    private firestore: Firestore,
    private authService: SocialAuthService,
  ) {this.authService.authState.subscribe((user) => {
      this.user = user;
      this.isLogged = !!user;
    }); 
  }

  ngOnInit() {
    // Escuchar promedio en tiempo real
    const docRef = doc(this.firestore, 'valoraciones', 'app');
    onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.promedio = data['promedio'] || 0;
        this.votos = data['total'] || 0;
      }
    });
  
    // Obtener el usuario logueado vía angularx-social-login
    this.authService.authState.subscribe(async (user: SocialUser | null) => {
  this.userId = user?.email || null;
  this.user = user;
  this.isLogged = !!user;

  if (this.userId)  {
    const ratingRef =  doc(this.firestore, 'ratings_por_usuario', this.userId);
    const docSnap = await getDoc(ratingRef);
    if (docSnap.exists()) {
      this.hasRated = true;
      this.value = docSnap.data()['nota'];
    }
  }
 });
}


  // Método para valorar la app
  async valorar(nota: number) {
    if (!user) {
      alert('Debes iniciar sesión para valorar');
      return;
    }

    const ratingRef = doc(this.firestore, 'ratings_por_usuario', this.userId!);
    const appRef = doc(this.firestore, 'valoraciones', 'app');

    const prev = await getDoc(ratingRef);
    const yaVotado = prev.exists() ? prev.data()['nota'] : null;
    this.rate = yaVotado;

    if (yaVotado !== null) {
      alert('Ya has valorado esta app. Gracias 😊 con un ' + yaVotado);
      return;
    }

    await setDoc(ratingRef, { nota });

    const appSnap = await getDoc(appRef);
    const datos = appSnap.exists() ? appSnap.data() : { total: 0, suma: 0 };
    const nuevaSuma = (datos['suma'] || 0) + nota;
    const nuevoTotal = (datos['total'] || 0) + 1;
    const nuevoPromedio = nuevaSuma / nuevoTotal;

    await setDoc(appRef, {
      suma: nuevaSuma,
      total: nuevoTotal,
      promedio: nuevoPromedio
    });

    alert('✅ ¡Gracias por tu valoración!');
  }


  // Método para compartir en WhatsApp
  compartirApp() {
    const texto = `Recibe un aforismo Andaluz cada día ¡¡ picha aquí para descargar la app: https://2v44zgxz-4200.uks1.devtunnels.ms/`;
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  }//end compartirEnWhatsApp
}
