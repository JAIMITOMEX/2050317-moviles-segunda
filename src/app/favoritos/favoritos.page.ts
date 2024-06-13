import { Component, OnInit } from '@angular/core';
import { FavoritosService } from '../favoritos.service';
import { ProductService } from '../product.service';
import { NavController } from '@ionic/angular'

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss']
})
export class FavoritosPage implements OnInit {
  favoritos: any[] = [];
  products: any[] = [];

  constructor(private favoritosService: FavoritosService, private productService: ProductService, private navCtrl: NavController) {}

  ngOnInit() {
    this.loadFavoritos();
  }

  async loadFavoritos() {
    const favoritos = await this.favoritosService.getFavoritos();
    const productIds = favoritos.map(fav => fav['IDproduct']);

    this.productService.getProducts().subscribe(products => {
      this.products = products.filter(product => productIds.includes(product.id));
    });
  }

  viewProduct(product) {
    this.navCtrl.navigateForward(['/product-detail', { product: JSON.stringify(product) }]);
  }

  async removeFavorito(product) {
    await this.favoritosService.removeFavorito(product.id);
    this.loadFavoritos();  // Recargar la lista de favoritos
  }
}

//este cartel indica que es cambio que aun no esta completo (quitar si aun existen fallas latentes en el sistema).