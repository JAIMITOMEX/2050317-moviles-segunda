import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReviewModalComponent } from './review-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [ReviewModalComponent],
  exports: [ReviewModalComponent]
})
export class ReviewModalComponentModule {}

//este cartel indica que es cambio que aun no esta completo (quitar si aun existen fallas latentes en el sistema).