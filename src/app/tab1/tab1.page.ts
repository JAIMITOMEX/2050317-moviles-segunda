import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { NavController } from '@ionic/angular';
import { FavoritosService } from '../favoritos.service';
import { AuthenticationService } from '../authentication.service';
import { UsersService } from '../users.service';
import { User } from '../models/user.model';
import { User as FirebaseUser } from '@angular/fire/auth';
import { ReviewService } from '../review.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  favoritos: Set<string> = new Set();
  showFilterBar = false;
  selectedFilter = 'All';
  searchQuery = '';  // Variable para almacenar el valor de búsqueda

  userInfo: User;

  constructor(
    private productService: ProductService,
    private navCtrl: NavController,
    private favoritosService: FavoritosService,
    private auth: AuthenticationService,
    private usersService: UsersService,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = data; // Inicialmente mostrar todos los productos

      // Para cada producto, obtener las calificaciones y reviews
      this.products.forEach(product => {
        this.reviewService.getProductReviews(product.id).subscribe(reviews => {
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          product.totalReviews = reviews.length;
          product.averageRating = reviews.length ? totalRating / reviews.length : 0;
        });
      });
    });
    this.loadFavoritos();
    this.loadUserInfo();
  }

  async loadFavoritos() {
    const favoritos = await this.favoritosService.getFavoritos();
    this.favoritos = new Set(favoritos.map(fav => fav['IDproduct']));
  }

  async loadUserInfo() {
    try {
      const user: FirebaseUser = await this.auth.getProfile();
      if (user) {
        const userData = await this.getUserData(user.uid);
        this.userInfo = userData;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  async getUserData(userId: string): Promise<User> {
    try {
      const userDoc = await this.usersService.findOne(userId);
      if (userDoc.exists()) {
        const data = userDoc.data();
        const fotos = Array.isArray(data['fotos']) ? data['fotos'] : [data['fotos']];
        return {
          id: userDoc.id,
          name: data['name'],
          email: data['email'],
          fotos: fotos,
        };
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      return null;
    }
  }

  viewProduct(product) {
    this.navCtrl.navigateForward(['/product-detail', { product: JSON.stringify(product) }]);
  }

  async toggleFavorito(event, product) {
    if (!product.id) {
      console.error('Product ID is undefined');
      return;
    }

    if (event.detail.checked) {
      await this.favoritosService.addFavorito(product.id);
      this.favoritos.add(product.id);
    } else {
      await this.favoritosService.removeFavorito(product.id);
      this.favoritos.delete(product.id);
    }
  }

  isFavorito(productId: string): boolean {
    return this.favoritos.has(productId);
  }

  handleInput(event) {
    this.searchQuery = event.target.value.toLowerCase();
    this.filterProducts(); // Aplicar filtro adicional si está seleccionado
  }

  toggleFilterBar() {
    this.showFilterBar = !this.showFilterBar;
  }

  filterProducts() {
    const query = this.searchQuery;
    if (this.selectedFilter === 'All') {
      this.filteredProducts = this.products.filter(product => product.name.toLowerCase().includes(query));
    } else {
      this.filteredProducts = this.products.filter(product => product.type === this.selectedFilter && product.name.toLowerCase().includes(query));
    }
  }
}

//este cartel indica que es cambio que aun no esta completo (quitar si aun existen fallas latentes en el sistema).