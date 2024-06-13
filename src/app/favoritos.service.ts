import { Injectable } from '@angular/core';
import { Firestore, collection, CollectionReference, DocumentData, addDoc, getDocs, query, where, deleteDoc, doc } from '@angular/fire/firestore';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private readonly coll: CollectionReference<DocumentData>;

  constructor(private database: Firestore, private authService: AuthenticationService) {
    this.coll = collection(this.database, 'favoritos');
  }

  async addFavorito(productId: string) {
    const user = await this.authService.getProfile();
    if (user && productId) {
      await addDoc(this.coll, { IDproduct: productId, IDuser: user.uid });
    } else {
      console.error('User or Product ID is undefined');
    }
  }

  async removeFavorito(productId: string) {
    const user = await this.authService.getProfile();
    if (user && productId) {
      const q = query(this.coll, where('IDproduct', '==', productId), where('IDuser', '==', user.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (favDoc) => {
        await deleteDoc(doc(this.coll, favDoc.id));
      });
    } else {
      console.error('User or Product ID is undefined');
    }
  }

  async getFavoritos() {
    const user = await this.authService.getProfile();
    if (user) {
      const q = query(this.coll, where('IDuser', '==', user.uid));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data());
    }
    return [];
  }
}

//este cartel indica que es cambio que aun no esta completo (quitar si aun existen fallas latentes en el sistema).