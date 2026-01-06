import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  logoExists = false;

  ngOnInit() {
    // Check if logo exists (you can adjust the path as needed)
    const img = new Image();
    img.onload = () => this.logoExists = true;
    img.onerror = () => this.logoExists = false;
    img.src = 'assets/logo.png';
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
