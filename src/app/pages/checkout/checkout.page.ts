import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonIcon,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  personOutline,
  mailOutline,
  callOutline,
  locationOutline,
  clipboardOutline,
  pinOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    CommonModule,
    FormsModule
  ]
})
export class CheckoutPage implements OnInit {
  fullName = '';
  email = '';
  phone = '';
  selectedSize = 9;
  sizes = [7, 8, 9, 10, 11];
  quantity = 1;
  quantities = [1, 2, 3, 4, 5];
  address = '';
  city = '';
  cities = ['New Delhi', 'Mumbai', 'Bangalore', 'Jaipur', 'Kolkata', 'Chennai', 'Pune'];
  state = '';
  states = ['Delhi', 'Maharashtra', 'Karnataka', 'Rajasthan', 'West Bengal', 'Tamil Nadu'];
  zip = '';
  agree = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController
  ) {
    addIcons({
      chevronBackOutline,
      personOutline,
      mailOutline,
      callOutline,
      locationOutline,
      clipboardOutline,
      pinOutline
    });
  }

  ngOnInit() {
    // 1. Fetch parameters passed from Preorder page
    this.route.queryParams.subscribe(params => {
      if (params['size']) {
        this.selectedSize = parseInt(params['size'], 10);
      }
      if (params['quantity']) {
        this.quantity = parseInt(params['quantity'], 10);
      }
    });

    // 2. Prefill user profile details if logged in
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      this.fullName = currentUser.fullName || '';
      this.email = currentUser.email || '';
    }
  }

  goBack() {
    this.router.navigate(['/preorder'], {
      queryParams: {
        size: this.selectedSize,
        quantity: this.quantity
      }
    });
  }

  async showToast(message: string, color: string = 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color
    });
    await toast.present();
  }

  async payNow() {
    // 1. Full Name validation (required, min 2 chars)
    if (!this.fullName || this.fullName.trim().length < 2) {
      await this.showToast('Please enter your full name', 'warning');
      return;
    }

    // 2. Email format validation (required, regex check)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.email || !emailRegex.test(this.email.trim())) {
      await this.showToast('Please enter a valid email address', 'warning');
      return;
    }

    // 3. Phone number validation (required, 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!this.phone || !phoneRegex.test(this.phone.trim())) {
      await this.showToast('Please enter a valid 10-digit phone number', 'warning');
      return;
    }

    // 4. Product Details validation
    if (!this.selectedSize) {
      await this.showToast('Please select a shoe size', 'warning');
      return;
    }
    if (!this.quantity || this.quantity < 1) {
      await this.showToast('Please select a valid quantity', 'warning');
      return;
    }

    // 5. Address validation (required, min 5 chars)
    if (!this.address || this.address.trim().length < 5) {
      await this.showToast('Please enter a complete delivery address', 'warning');
      return;
    }

    // 6. City validation (required)
    if (!this.city) {
      await this.showToast('Please select your city', 'warning');
      return;
    }

    // 7. State validation (required)
    if (!this.state) {
      await this.showToast('Please select your state', 'warning');
      return;
    }

    // 8. Zip code validation (required, 6 digits)
    const zipRegex = /^\d{6}$/;
    if (!this.zip || !zipRegex.test(this.zip.trim())) {
      await this.showToast('Please enter a valid 6-digit ZIP code', 'warning');
      return;
    }

    // 9. Terms and conditions validation (required)
    if (!this.agree) {
      await this.showToast('You must agree to the Terms & Conditions and Privacy Policy', 'warning');
      return;
    }

    // Process checkout transaction (simulate payment gateway trigger)
    const toast = await this.toastController.create({
      message: 'Processing payment... Redirecting to checkout sandbox.',
      duration: 1500,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();

    setTimeout(() => {
      // Mock order completion and save to order history
      const ordersStr = localStorage.getItem('orders');
      const orders = ordersStr ? JSON.parse(ordersStr) : [];
      orders.push({
        fullName: this.fullName,
        email: this.email,
        phone: this.phone,
        size: this.selectedSize,
        quantity: this.quantity,
        address: this.address,
        city: this.city,
        state: this.state,
        zip: this.zip,
        date: new Date().toISOString()
      });
      localStorage.setItem('orders', JSON.stringify(orders));

      this.toastController.create({
        message: 'Preorder placed successfully! Order ID: RN-' + Math.floor(Math.random() * 900000 + 100000),
        duration: 2500,
        position: 'bottom',
        color: 'success'
      }).then(successToast => successToast.present());

      this.router.navigate(['/home']);
    }, 1500);
  }
}
