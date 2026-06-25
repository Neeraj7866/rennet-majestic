import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  locationOutline,
  flashOutline,
  waterOutline,
  shieldOutline,
  cartOutline,
  chevronBackOutline,
  chevronForwardOutline,
  play
} from 'ionicons/icons';

interface Slide {
  image: string;
  type: 'card' | 'thumb';
  name: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    CommonModule,
    FormsModule,
    RouterLink
  ]
})
export class HomePage implements OnInit {
  currentSlide = 0;
  isPlayingVideo = false;
  safeVideoUrl: SafeResourceUrl;

  slides: Slide[] = [
    { image: 'assets/hero_shoe_card.png', type: 'card', name: 'Exploded View' },
    { image: 'assets/rennect_swipe_image.jpg', type: 'thumb', name: 'Side View' },
    { image: 'assets/rennect_front_view.png', type: 'thumb', name: 'Side Profile' },
    { image: 'assets/rennect_sole_view.png', type: 'thumb', name: 'Sole View' },
    { image: 'assets/hero_shoe_card.png', type: 'card', name: 'Exploded View' }
  ];

  constructor(private sanitizer: DomSanitizer) {
    addIcons({
      locationOutline,
      flashOutline,
      waterOutline,
      shieldOutline,
      cartOutline,
      chevronBackOutline,
      chevronForwardOutline,
      play
    });

    // Sanitize the YouTube embed URL for safe rendering in iframe
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/eh5OR4MpyAc?autoplay=1'
    );
  }

  ngOnInit() {
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  selectSlide(index: number) {
    this.currentSlide = index;
  }

  playVideo() {
    this.isPlayingVideo = true;
  }
}
