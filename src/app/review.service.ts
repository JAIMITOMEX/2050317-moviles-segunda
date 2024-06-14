import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private reviewsUpdated = new Subject<void>();

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

  addReview(review: { productId: string; rating: number; review: string; timestamp: Date; userId: string }) {
    return this.firestore.collection('reviews').add(review).then(() => {
      this.reviewsUpdated.next(); // Emitir evento de actualización
    });
  }

  getReviewsUpdatedListener(): Observable<void> {
    return this.reviewsUpdated.asObservable();
  }
}
