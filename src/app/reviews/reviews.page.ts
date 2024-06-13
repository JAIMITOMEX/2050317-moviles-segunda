import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../review.service';
import { UsersService } from '../users.service';
import { User } from '../models/user.model';
import { User as FirebaseUser } from '@angular/fire/auth';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss']
})
export class ReviewsPage implements OnInit {
  reviews: any[] = [];
  userInfo: User;

  constructor(private reviewService: ReviewService, private usersService: UsersService, private auth: AuthenticationService) {}

  ngOnInit() {
    this.loadReviews();
    this.loadUserInfo();
  }

  loadReviews() {
    this.reviewService.getReviews().subscribe(reviews => {
      this.reviews = reviews.map(review => {
        if (review.userId) {
          // Si hay userId, obtén el nombre de usuario y la foto
          return {
            ...review,
            userName: this.getUserName(review.userId),
            userPhoto: this.getUserPhoto(review.userId)
          };
        } else {
          // Si no hay userId, mantener como anónimo
          return {
            ...review,
            userName: 'Anonymous',
            userPhoto: 'URL_de_la_imagen_anónima' // Puedes poner una imagen por defecto para anónimos si es necesario
          };
        }
      });
    });
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

  async getUserName(userId: string): Promise<string> {
    try {
      const user = await this.getUserData(userId);
      return user ? user.name : 'Unknown';
    } catch (error) {
      console.error('Error fetching user name:', error);
      return 'Unknown';
    }
  }

  async getUserPhoto(userId: string): Promise<string> {
    try {
      const user = await this.getUserData(userId);
      return user && user.fotos.length > 0 ? user.fotos[0] : 'URL_de_la_imagen_por_defecto';
    } catch (error) {
      console.error('Error fetching user photo:', error);
      return 'URL_de_la_imagen_por_defecto';
    }
  }
}

//este cartel indica que es cambio que aun no esta completo (quitar si aun existen fallas latentes en el sistema)