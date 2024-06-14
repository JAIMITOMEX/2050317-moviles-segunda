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
  userId: string;

  constructor(private modalController: ModalController, private reviewService: ReviewService) {}

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }

  async submitReview() {
    if (this.rating && this.review) {
      await this.reviewService.addReview({
        rating: this.rating,
        review: this.review,
        productId: this.productId,
        timestamp: new Date(),
        userId: this.userId
      });
      this.modalController.dismiss();
    }
  }
}
