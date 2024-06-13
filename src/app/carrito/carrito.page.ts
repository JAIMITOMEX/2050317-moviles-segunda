import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../carrito.service';
import { AuthenticationService } from '../authentication.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  carritoItems: any[] = [];
  userId: string;
  total: number = 0;

  constructor(
    private carritoService: CarritoService,
    private authService: AuthenticationService,
    private navCtrl: NavController,
    private toastController: ToastController
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

  removeFromCarrito(itemId) {
    this.carritoService.removeItemFromCarrito(itemId).then(() => {
      this.loadCarrito();
      this.presentToast('Producto eliminado del carrito');
    });
  }

  calculateTotal() {
    this.total = this.carritoItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }

  async checkout() {
    await this.carritoService.clearCarrito(this.userId);
    this.loadCarrito();  // Recargar el carrito para reflejar los cambios
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

//este cartel indica que es cambio que aun no esta completo (quitar si aun existen fallas latentes en el sistema).