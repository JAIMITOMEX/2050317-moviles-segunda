import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app'
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  UserCredential
} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(public ngFireAuth: Auth) {}

  async registerUser(email: string, password: string): Promise<UserCredential> {
    return await createUserWithEmailAndPassword(this.ngFireAuth, email, password);
  }

  async loginUser(email: string, password: string)  {
    return await signInWithEmailAndPassword(this.ngFireAuth, email, password)
  }

  async resetPassword(email: string){
    return await sendPasswordResetEmail(this.ngFireAuth, email)
  }

  async signOut(){
    return await signOut(this.ngFireAuth);
  }

  async getProfile(){
    return await this.ngFireAuth.currentUser;
  }
}