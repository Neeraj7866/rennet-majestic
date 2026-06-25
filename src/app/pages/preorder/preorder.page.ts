import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  chevronForwardOutline,
  removeOutline,
  addOutline,
  shieldCheckmarkOutline,
  lockClosedOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-preorder',
  templateUrl: './preorder.page.html',
  styleUrls: ['./preorder.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    CommonModule,
    FormsModule
  ]
})
export class PreorderPage implements OnInit {
  selectedSize = 9;
  sizes = [7, 8, 9, 10, 11];
  quantity = 1;
  depositPrice = 2499;
  totalPrice = 2499;

  constructor(private router: Router) {
    addIcons({
      chevronBackOutline,
      chevronForwardOutline,
      removeOutline,
      addOutline,
      shieldCheckmarkOutline,
      lockClosedOutline
    });
  }

  ngOnInit() {}

  selectSize(size: number) {
    this.selectedSize = size;
  }

  increaseQty() {
    this.quantity++;
    this.updateTotal();
  }

  decreaseQty() {
    if (this.quantity > 1) {
      this.quantity--;
      this.updateTotal();
    }
  }

  updateTotal() {
    this.totalPrice = this.depositPrice * this.quantity;
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  reserveNow() {
    this.router.navigate(['/checkout'], {
      queryParams: {
        size: this.selectedSize,
        quantity: this.quantity
      }
    });
  }
}
