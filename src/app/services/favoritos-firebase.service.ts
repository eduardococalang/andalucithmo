/*
Este servicio se encarga de gestionar los favoritos en Firebase 
*/ 

import { onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';

import { collection, query, orderBy, limit, getDocs, CollectionReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FavoritosFirebaseService {

  constructor(
    private firestore: Firestore
  ) {}

// Método para incrementar el contador de favoritos en Firestore
  // Si la palabra no existe, se crea un nuevo documento con contador 1
  async incrementarFavorito(palabra: string): Promise<void> {
    try {
      if (!palabra) throw new Error("La palabra no es válida");
  
      const docRef = doc(this.firestore, 'favoritos_globales', palabra);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const datos = docSnap.data();
        const nuevoContador = (datos['contador'] || 0) + 1;
        await updateDoc(docRef, { contador: nuevoContador });
      } else {
        await setDoc(docRef, { contador: 1 });
      }
    } catch (error) {
      console.error('OJO, Error al incrementar favorito en Firestore:', error);
    }
  }// fin incrementarFavorito

  async decrementarFavorito(palabra: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'favoritos_globales', palabra);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const datos = docSnap.data();
        const contadorActual = datos['contador'] ?? 1; // default 1 si no existe
        const nuevoContador = Math.max(contadorActual - 1, 0);
  
        console.log('Disminuyendo contador para:', palabra);
        console.log('Contador actual:', contadorActual, '→ Nuevo:', nuevoContador);
  
        await updateDoc(docRef, { contador: nuevoContador });
      } else {
        console.warn('⚠️ Documento no existe en Firestore:', palabra);
      }
    } catch (error) {
      console.error('❌ Error al decrementar favorito en Firestore:', error);
    }
  }// fin decrementarFavorito
  
  
  async obtenerContador(palabra:string): Promise<number>{
    const docRef = doc(this.firestore, 'favoritos_globales', palabra);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data()['contador'] || 0;
    } else {
      return 0;
    }
  }// fin obtenerContador


  //Esto devuelve un Observable<number> que emite cada vez que el contador cambia en Firebase.
  getContadorObservable(palabra: string): Observable<number> {
    return new Observable<number>((observer) => {
      const docRef = doc(this.firestore, 'favoritos_globales', palabra);
  
      return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          observer.next(docSnap.data()['contador'] || 0);
        } else {
          observer.next(0);
        }
      }, (error) => {
        console.error("Error en onSnapshot:", error);
        observer.error(error);
      });
    });
  }// fin getContadorObservable	

  
  // Método para obtener el ranking de los N favoritos más populares
  // Devuelve un array de objetos con la palabra y su contador
  async obtenerRankingTopN(n: number): Promise<{ palabra: string; contador: number }[]> {
    try {
      const colRef = collection(this.firestore, 'favoritos_globales');
      const q = query(colRef, orderBy('contador', 'desc'), limit(n));
      const snapshot = await getDocs(q);
  
      return snapshot.docs.map(doc => ({
        palabra: doc.id,
        contador: doc.data()['contador'] || 0
      }));
    } catch (error) {
      console.error('Error al obtener ranking de favoritos:', error);
      return [];
    }
  }// fin obtenerRankingTopN

  // Método para obtener un Observable que emite el ranking de los N favoritos más populares
  getRankingObservable(n: number): Observable<{ palabra: string; contador: number }[]> {
    return new Observable(observer => {
      const colRef = collection(this.firestore, 'favoritos_globales');
      const q = query(colRef, orderBy('contador', 'desc'), limit(n));
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const ranking = snapshot.docs.map(doc => ({
          palabra: doc.id,
          contador: doc.data()['contador'] || 0
        }));
        observer.next(ranking);
      }, (error) => {
        console.error("Error en snapshot de ranking:", error);
        observer.error(error);
      });
  
      return () => unsubscribe(); // Cleanup
    });
  }// fin getRankingObservable

  
}

