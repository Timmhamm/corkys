import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  newsletterEmail = '';

  onNewsletterSubmit(event: Event) {
    event.preventDefault();
    if (this.newsletterEmail) {
      // In a real application, this would send the email to a backend service
      alert('Thank you for subscribing to our newsletter!');
      this.newsletterEmail = '';
    }
  }
}
