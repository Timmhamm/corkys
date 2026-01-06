import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  onSubmit(event: Event) {
    event.preventDefault();
    // In a real application, this would send the form data to a backend service
    alert('Thank you for your message! We will get back to you soon.');
    this.formData = {
      name: '',
      email: '',
      phone: '',
      message: ''
    };
  }
}
