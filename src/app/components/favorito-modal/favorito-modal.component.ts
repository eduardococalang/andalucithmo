import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Favorito } from '../../models/favorito.model';
import { FavoritosFirebaseService } from '../../services/favoritos-firebase.service';
import { OnInit } from '@angular/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-favorito-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatCardModule],
  templateUrl: './favorito-modal.component.html',
  styleUrls: ['./favorito-modal.component.scss']
})
export class FavoritoModalComponent {
  contador: number = 0;
  private contadorSub!: Subscription;
  favoritosFirestore: any;

  constructor(
    public dialogRef: MatDialogRef<FavoritoModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: Favorito,
    private favoritosFirebaseService: FavoritosFirebaseService
  ) { }

  // Se ejecuta cuando el componente se inicializa
  ngOnInit() {

    this.contadorSub = this.favoritosFirebaseService
      .getContadorObservable(this.data.palabra)
      .subscribe((contador: number) => {
        this.contador = contador;
      });
  }
  // Se ejecuta cuando el componente se destruye
  ngOnDestroy() {
    if (this.contadorSub) {
      this.contadorSub.unsubscribe();
    }
  }




  // Método cierra el modal
  cerrar() {
    this.dialogRef.close();
  }



  // Método envía un mensaje de WhatsApp
  compartirFavorito() {
    const texto = `⭐ ${this.data.palabra}\n\n📖 Definición: ${this.data.definicion}\n✍️ Ejemplo: ${this.data.ejemplo}`;
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  }
}
