import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../carrito.service';
import { AuthenticationService } from '../authentication.service';
import { NavController, ToastController, PopoverController, IonPopover } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  carritoItems: any[] = [];
  userId: string;
  total: number = 0;
  selectedCard: string = '';  // Variable para almacenar la tarjeta seleccionada

  constructor(
    private carritoService: CarritoService,
    private authService: AuthenticationService,
    private navCtrl: NavController,
    private toastController: ToastController,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {
    this.authService.getProfile().then(user => {
      this.userId = user.uid;
      this.loadCarrito();
    });
  }

  loadCarrito() {
    this.carritoService.getCarrito(this.userId).subscribe(items => {
      this.carritoItems = items;
      this.calculateTotal();
    });
  }

  incrementQuantity(item) {
    item.quantity++;
    this.carritoService.updateItemQuantity(item.id, item.quantity).then(() => {
      this.calculateTotal();
    });
  }

  decrementQuantity(item) {
    if (item.quantity > 1) {
      item.quantity--;
      this.carritoService.updateItemQuantity(item.id, item.quantity).then(() => {
        this.calculateTotal();
      });
    }
  }

  async presentPopover(event: Event, itemId: string) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event,
      translucent: true
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();
    if (data && data.confirm) {
      await this.removeFromCarrito(itemId);
      popover.dismiss();
    }
  }

  async removeFromCarrito(itemId: string) {
    await this.carritoService.removeItemFromCarrito(itemId);
    this.loadCarrito();
    this.presentToast('Producto eliminado del carrito');
  }

  calculateTotal() {
    this.total = this.carritoItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }

  async checkout() {
    await this.carritoService.clearCarrito(this.userId);
    this.loadCarrito();  // Recargar el carrito para reflejar los cambios
    this.selectedCard = '';  // Deseleccionar la tarjeta
    this.navCtrl.navigateForward('/home');
    this.presentToast('Compra realizada con éxito');
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }
}
