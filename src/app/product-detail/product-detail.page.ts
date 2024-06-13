import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { ReviewModalComponent } from '../review-modal/review-modal.component';
import { CarritoService } from '../carrito.service';
import { AuthenticationService } from '../authentication.service';
import { User } from '../models/user.model';
import { UsersService } from '../users.service';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss']
})
export class ProductDetailPage implements OnInit {
  product: any;
  userId: string;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private carritoService: CarritoService,
    private authService: AuthenticationService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.product = JSON.parse(params['product']);
      if (!this.product.averageRating || !this.product.totalReviews) {
        this.product.averageRating = this.product.averageRating || 0;
        this.product.totalReviews = this.product.totalReviews || 0;
      }
      this.authService.getProfile().then(user => {
        this.userId = user.uid;
      });
    });
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  async addToCarrito() {
    await this.carritoService.addItemToCarrito(this.userId, this.product, this.quantity);
    const toast = await this.toastController.create({
      message: 'Producto añadido al carrito',
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }


  async openReviewModal() {
    const modal = await this.modalController.create({
      component: ReviewModalComponent,
      componentProps: { productId: this.product.id }
    });
    return await modal.present();
  }
}

//este cartel indica que es cambio que aun no esta completo (quitar si aun existen fallas latentes en el sistema).