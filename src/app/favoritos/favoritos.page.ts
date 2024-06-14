import { Component, OnInit, OnDestroy } from '@angular/core';
import { FavoritosService } from '../favoritos.service';
import { ProductService } from '../product.service';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss']
})
export class FavoritosPage implements OnInit, OnDestroy {
  favoritos: any[] = [];
  products: any[] = [];
  private favoritosSub: Subscription;

  constructor(
    private favoritosService: FavoritosService,
    private productService: ProductService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.loadFavoritos();
    this.favoritosSub = this.favoritosService.getFavoritosUpdatedListener().subscribe(() => {
      this.loadFavoritos();
    });
  }

  ngOnDestroy() {
    if (this.favoritosSub) {
      this.favoritosSub.unsubscribe();
    }
  }

  async loadFavoritos() {
    try {
      const favoritos = await this.favoritosService.getFavoritos();
      const productIds = favoritos.map(fav => fav['IDproduct']);
      this.productService.getProducts().subscribe(products => {
        this.products = products.filter(product => productIds.includes(product.id));
      });
    } catch (error) {
      console.error('Error loading favoritos:', error);
    }
  }

  viewProduct(product) {
    this.navCtrl.navigateForward(['/product-detail', { product: JSON.stringify(product) }]);
  }

  async removeFavorito(product) {
    try {
      await this.favoritosService.removeFavorito(product.id);
      // No need to call loadFavoritos() again since it will be triggered by the event
    } catch (error) {
      console.error('Error removing favorito:', error);
    }
  }
}
