import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ReviewService } from '../review.service';

@Component({
  selector: 'app-review-modal',
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.scss'],
})
export class ReviewModalComponent implements OnInit {
  rating: number;
  review: string;
  productId: string;

  constructor(private modalController: ModalController, private reviewService: ReviewService) {}

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }

  submitReview() {
    if (this.rating && this.review) {
      this.reviewService.addReview({ rating: this.rating, review: this.review, productId: this.productId, timestamp: new Date() }).then(() => {
        this.modalController.dismiss();
      });
    }
  }
}

//este cartel indica que es cambio que aun no esta completo (quitar si aun existen fallas latentes en el sistema).