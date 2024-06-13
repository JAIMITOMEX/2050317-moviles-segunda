import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AngularFireAuthModule } from '@angular/fire/compat/auth'
import {AngularFireModule} from '@angular/fire/compat'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { ReviewModalComponentModule } from './review-modal/review-modal.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    AngularFireModule, AngularFireAuthModule, AngularFireModule.initializeApp(environment.firebaseConfig), ReviewModalComponentModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideFirebaseApp(() => initializeApp({"projectId":"j-notes-a431e","appId":"1:718113596216:web:3b037bfd1a17b067f1d7cd","storageBucket":"j-notes-a431e.appspot.com","apiKey":"AIzaSyAJiDJxALRKGmfAHANPrEwdeXhOq96gR3k","authDomain":"j-notes-a431e.firebaseapp.com","messagingSenderId":"718113596216","measurementId":"G-97T8WSD9NR"})), provideAuth(() => getAuth()), provideAnalytics(() => getAnalytics()), ScreenTrackingService, UserTrackingService, provideFirestore(() => getFirestore())],
  bootstrap: [AppComponent],
})
export class AppModule {}
