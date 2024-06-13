import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { UsersService } from '../users.service';
import { User as FirebaseUser } from '@angular/fire/auth';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  userInfo: User;

  constructor(private auth: AuthenticationService, private router: Router, private usersService: UsersService) {}

  async logout() {
    try {
      await this.auth.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.log(error);
    }

  }

  async ngOnInit() {
    try {
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