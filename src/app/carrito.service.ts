import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private carritoCollectionName = 'carrito';

  constructor(private firestore: AngularFirestore) { }

  getCarrito(userId: string): Observable<any[]> {
    return this.firestore.collection(this.carritoCollectionName, ref => ref.where('userId', '==', userId)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Record<string, any>;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  addItemToCarrito(userId: string, product: any, quantity: number): Promise<any> {
    const carritoItem = { userId, product, quantity };
    return this.firestore.collection(this.carritoCollectionName).add(carritoItem);
  }

  updateItemQuantity(itemId: string, quantity: number): Promise<void> {
    return this.firestore.collection(this.carritoCollectionName).doc(itemId).update({ quantity });
  }

  removeItemFromCarrito(itemId: string): Promise<void> {
    return this.firestore.collection(this.carritoCollectionName).doc(itemId).delete();
  }

  async clearCarrito(userId: string): Promise<void> {
    const carritoRef = this.firestore.collection(this.carritoCollectionName, ref => ref.where('userId', '==', userId));
    
    try {
      const snapshot = await carritoRef.get().toPromise();
      
      if (!snapshot.empty) {
        const batch = this.firestore.firestore.batch();
        
        snapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        await batch.commit();
      }
    } catch (error) {
      console.error('Error clearing carrito:', error);
      throw error;
    }
  }
}

//este cartel indica que es cambio que aun no esta completo (quitar si aun existen fallas latentes en el sistema)