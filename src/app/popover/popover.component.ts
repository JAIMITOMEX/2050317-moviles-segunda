import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  template: `
    <ion-content>
      <ion-list>
        <ion-item button (click)="confirm()">¿Desea eliminar?</ion-item>
        <ion-item button (click)="dismiss()">Cancelar</ion-item>
      </ion-list>
    </ion-content>
  `
})
export class PopoverComponent {
  constructor(private popoverController: PopoverController) {}

  confirm() {
    this.popoverController.dismiss({ confirm: true });
  }

  dismiss() {
    this.popoverController.dismiss({ confirm: false });
  }
}