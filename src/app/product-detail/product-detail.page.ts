import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { ReviewModalComponent } from '../review-modal/review-modal.component';
import { CarritoService } from '../carrito.service';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { ReviewService } from '../review.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss']
})
export class ProductDetailPage implements OnInit, OnDestroy {
  product: any;
  userId: string;
  quantity: number = 1;
  private reviewSub: Subscription;

  sizes: string[] = ['S', 'M', 'L', 'XL'];
  colors: string[] = ['Gray', 'Black', 'White'];
  selectedSize: string = '';
  selectedColor: string = '';
  canAddToCart: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private carritoService: CarritoService,
    private authService: AuthenticationService,
    private toastController: ToastController,
    private router: Router,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.product = JSON.parse(params['product']);
      if (!this.product.averageRating || !this.product.totalReviews) {
        this.product.averageRating = this.product.averageRating || 0;
        this.product.totalReviews = this.product.totalReviews || 0;
      }
      this.authService.getProfile().then(user => {
        if (user && user.uid) {
          this.userId = user.uid;
        } else {
          this.handleUserNotLoggedIn();
        }
      });
    });

    this.reviewSub = this.reviewService.getReviewsUpdatedListener().subscribe(() => {
      this.loadReviews();
    });
  }

  ngOnDestroy() {
    if (this.reviewSub) {
      this.reviewSub.unsubscribe();
    }
  }

  async handleUserNotLoggedIn() {
    const toast = await this.toastController.create({
      message: 'User not logged in. Please log in first.',
      duration: 2000,
      color: 'warning'
    });
    toast.present();

    // Redirige al login
    this.router.navigate(['/login']);
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  checkSelections() {
    this.canAddToCart = this.selectedSize !== '' && this.selectedColor !== '';
  }

  async addToCarrito() {
    if (!this.userId) {
      const toast = await this.toastController.create({
        message: 'User not logged in. Please log in first.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }

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
      componentProps: { productId: this.product.id, userId: this.userId }
    });
    return await modal.present();
  }

  viewReviews() {
    if (this.product.id) {
      this.router.navigate(['/reviews'], { queryParams: { productId: this.product.id } });
    } else {
      console.error('Product ID is undefined');
    }
  }

  async loadReviews() {
    this.reviewService.getProductReviews(this.product.id).subscribe(reviews => {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      this.product.totalReviews = reviews.length;
      this.product.averageRating = reviews.length ? totalRating / reviews.length : 0;
    });
  }
}
