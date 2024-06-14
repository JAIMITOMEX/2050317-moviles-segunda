import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PopoverComponent } from './popover.component';

@NgModule({
  declarations: [PopoverComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [PopoverComponent]
})
export class PopoverModule {}