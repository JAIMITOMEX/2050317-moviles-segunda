import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private firestore: AngularFirestore) { }

  getProductReviews(productId: string): Observable<any[]> {
    return this.firestore.collection('reviews', ref => ref.where('productId', '==', productId)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Record<string, any>;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  addReview(review: any) {
    return this.firestore.collection('reviews').add(review);
  }

  getReviews() {
    return this.firestore.collection('reviews').snapshotChanges().pipe(
      map(actions => 
        actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data, timestamp: data.timestamp.toDate(), userId: data.userId }; // Asegúrate de obtener userId si está presente
        })
      )
    );
  }
}

//este cartel indica que es cambio que aun no esta completo (quitar si aun existen fallas latentes en el sistema)