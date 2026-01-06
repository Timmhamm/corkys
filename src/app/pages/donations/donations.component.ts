import { Component } from '@angular/core';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css']
})
export class DonationsComponent {
  downloadForm(event: Event) {
    event.preventDefault();
    // In a real application, this would download the PDF form
    alert('Please visit our store to pick up a donation request form, or contact us at 570-586-9563 for more information.');
  }
}
