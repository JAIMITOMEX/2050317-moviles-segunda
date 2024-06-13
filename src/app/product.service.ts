import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private firestore: AngularFirestore) { }

  getProducts(): Observable<any[]> {
    return this.firestore.collection('products').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Record<string, any>;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getProductRating(productId: string): Observable<any> {
    return this.firestore.collection('product_ratings').doc(productId).valueChanges();
  }

  getReviews(productId: string): Observable<any[]> {
    return this.firestore.collection('reviews', ref => ref.where('productId', '==', productId)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Record<string, any>;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  addReview(review: any): Promise<any> {
    return this.firestore.collection('reviews').add(review);
  }

  updateProductRating(productId: string, rating: number): Promise<void> {
    const productRatingRef = this.firestore.collection('product_ratings').doc(productId);
    return this.firestore.firestore.runTransaction(async transaction => {
      const productRatingDoc = await transaction.get(productRatingRef.ref);
      if (!productRatingDoc.exists) {
        transaction.set(productRatingRef.ref, { productId, averageRating: rating, totalReviews: 1 });
      } else {
        const data = productRatingDoc.data() as any;
        const newTotalReviews = data.totalReviews + 1;
        const newAverageRating = ((data.averageRating * data.totalReviews) + rating) / newTotalReviews;
        transaction.update(productRatingRef.ref, { averageRating: newAverageRating, totalReviews: newTotalReviews });
      }
    });
  }
}

//este cartel indica que es cambio que aun no esta completo (quitar si aun existen fallas latentes en el sistema).