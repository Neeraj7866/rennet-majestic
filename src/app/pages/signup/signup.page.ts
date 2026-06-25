import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logoApple } from 'ionicons/icons';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    CommonModule,
    FormsModule,
    RouterLink
  ]
})
export class SignupPage implements OnInit {
  fullName = '';
  email = '';
  password = '';
  showPassword = false;

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {
    addIcons({ personOutline, mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logoApple });
  }

  ngOnInit() {
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async signup() {
    if (!this.fullName || !this.email || !this.password) {
      const toast = await this.toastController.create({
        message: 'Please fill in all fields',
        duration: 2000,
        position: 'bottom',
        color: 'warning'
      });
      await toast.present();
      return;
    }

    // 1. Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const trimmedEmail = this.email.trim();
    if (!emailRegex.test(trimmedEmail)) {
      const toast = await this.toastController.create({
        message: 'Please enter a valid email address',
        duration: 2000,
        position: 'bottom',
        color: 'warning'
      });
      await toast.present();
      return;
    }

    // 2. Password format validation (minimum 6 characters, must contain at least one letter and one number)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(this.password)) {
      const toast = await this.toastController.create({
        message: 'Password must be at least 6 characters and contain both letters and numbers',
        duration: 2500,
        position: 'bottom',
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const usersStr = localStorage.getItem('users');
    const users = usersStr ? JSON.parse(usersStr) : [];

    const existingUser = users.find(
      (u: any) => u.email.trim().toLowerCase() === trimmedEmail.toLowerCase()
    );
    if (existingUser) {
      const toast = await this.toastController.create({
        message: 'Email address already registered',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
      return;
    }

    users.push({
      fullName: this.fullName.trim(),
      email: trimmedEmail.toLowerCase(),
      password: this.password
    });

    localStorage.setItem('users', JSON.stringify(users));

    const toast = await this.toastController.create({
      message: 'Registration successful! Please login.',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();

    this.router.navigate(['/login']);
  }
}
