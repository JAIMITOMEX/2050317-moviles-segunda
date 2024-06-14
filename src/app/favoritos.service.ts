import { Injectable } from '@angular/core';
import { Firestore, collection, CollectionReference, DocumentData, addDoc, getDocs, query, where, deleteDoc, doc } from '@angular/fire/firestore';
import { AuthenticationService } from './authentication.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private readonly coll: CollectionReference<DocumentData>;
  private favoritosUpdated = new Subject<void>();

  constructor(private database: Firestore, private authService: AuthenticationService) {
    this.coll = collection(this.database, 'favoritos');
  }

  getFavoritosUpdatedListener() {
    return this.favoritosUpdated.asObservable();
  }

  async addFavorito(productId: string) {
    try {
      const user = await this.authService.getProfile();
      if (user && productId) {
        await addDoc(this.coll, { IDproduct: productId, IDuser: user.uid });
        this.favoritosUpdated.next(); // Emitir evento de actualización
      } else {
        console.error('User or Product ID is undefined');
      }
    } catch (error) {
      console.error('Error adding favorito:', error);
    }
  }

  async removeFavorito(productId: string) {
    try {
      const user = await this.authService.getProfile();
      if (user && productId) {
        const q = query(this.coll, where('IDproduct', '==', productId), where('IDuser', '==', user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (favDoc) => {
          await deleteDoc(doc(this.coll, favDoc.id));
        });
        this.favoritosUpdated.next(); // Emitir evento de actualización
      } else {
        console.error('User or Product ID is undefined');
      }
    } catch (error) {
      console.error('Error removing favorito:', error);
    }
  }

  async getFavoritos() {
    try {
      const user = await this.authService.getProfile();
      if (user) {
        const q = query(this.coll, where('IDuser', '==', user.uid));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data());
      }
      return [];
    } catch (error) {
      console.error('Error getting favoritos:', error);
      return [];
    }
  }
}
