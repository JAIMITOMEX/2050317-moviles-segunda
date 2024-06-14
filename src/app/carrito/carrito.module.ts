import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarritoPageRoutingModule } from './carrito-routing.module';

import { CarritoPage } from './carrito.page';
import { PopoverComponent } from '../popover/popover.component';
import { PopoverModule } from '../popover/popover.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarritoPageRoutingModule,
    PopoverModule
  ],
  declarations: [CarritoPage]
})
export class CarritoPageModule {}
