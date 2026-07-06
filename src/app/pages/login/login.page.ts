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
  IonCheckbox,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logoApple } from 'ionicons/icons';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup
} from '@angular/fire/auth';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonCheckbox,
    CommonModule,
    FormsModule,
    RouterLink
  ]
})
export class LoginPage implements OnInit {
  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private auth: Auth
  ) {
    addIcons({ mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logoApple });
  }

  ngOnInit() {
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  async googleLogin() {
  try {
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: 'select_account'
    });

    const result = await signInWithPopup(this.auth, provider);

    console.log(result.user);

    const toast = await this.toastController.create({
      message: `Welcome ${result.user.displayName}`,
      duration: 2000,
      color: 'success'
    });

    await toast.present();

    this.router.navigate(['/home']);

  } catch (error) {
    console.error(error);

    const toast = await this.toastController.create({
      message: 'Google Login Failed',
      duration: 2000,
      color: 'danger'
    });

    await toast.present();
  }
}

  async login() {
    if (!this.email || !this.password) {
      const toast = await this.toastController.create({
        message: 'Please enter both email and password',
        duration: 2000,
        position: 'bottom',
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const usersStr = localStorage.getItem('users');
    const users = usersStr ? JSON.parse(usersStr) : [];

    const matchedUser = users.find(
      (u: any) => u.email.toLowerCase() === this.email.toLowerCase() && u.password === this.password
    );

    if (!matchedUser) {
      const toast = await this.toastController.create({
        message: 'Invalid email or password',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
      return;
    }

    localStorage.setItem('currentUser', JSON.stringify(matchedUser));

    const toast = await this.toastController.create({
      message: `Welcome back, ${matchedUser.fullName}!`,
      duration: 1500,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();

    this.router.navigate(['/home']);
  }
}
