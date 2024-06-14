import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReviewService } from '../review.service';
import { UsersService } from '../users.service';
import { User } from '../models/user.model';
import { User as FirebaseUser } from '@angular/fire/auth';
import { AuthenticationService } from '../authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss']
})
export class ReviewsPage implements OnInit, OnDestroy {
  reviews: any[] = [];
  userInfo: User;
  private reviewSub: Subscription;
  productId: string;

  constructor(private reviewService: ReviewService, private usersService: UsersService, private auth: AuthenticationService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.productId = params['productId'];
      if (this.productId) {
        this.loadReviews();
      } else {
        console.error('Product ID is undefined');
      }
    });
    this.loadUserInfo();
    this.reviewSub = this.reviewService.getReviewsUpdatedListener().subscribe(() => {
      if (this.productId) {
        this.loadReviews();
      }
    });
  }

  ngOnDestroy() {
    if (this.reviewSub) {
      this.reviewSub.unsubscribe();
    }
  }

  loadReviews() {
    if (this.productId) {
      this.reviewService.getProductReviews(this.productId).subscribe(reviews => {
        this.reviews = reviews;
      });
    } else {
      console.error('Product ID is undefined');
    }
  }

  async loadUserInfo() {
    try {
      // Aquí obtenemos el perfil del usuario actual, similar a como se hace en Tab1Page
      const user: FirebaseUser = await this.auth.getProfile();
      if (user) {
        const userData = await this.getUserData(user.uid);
        this.userInfo = userData;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  async getUserData(userId: string): Promise<User> {
    try {
      const userDoc = await this.usersService.findOne(userId);
      if (userDoc.exists()) {
        const data = userDoc.data();
        const fotos = Array.isArray(data['fotos']) ? data['fotos'] : [data['fotos']];
        return {
          id: userDoc.id,
          name: data['name'],
          email: data['email'],
          fotos: fotos,
        };
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      return null;
    }
  }
}
