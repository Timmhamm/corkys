import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop/shop.component';
import { EventsComponent } from './pages/events/events.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ResourcesComponent } from './pages/resources/resources.component';
import { CareersComponent } from './pages/careers/careers.component';
import { DonationsComponent } from './pages/donations/donations.component';
import { ToolsComponent } from './pages/tools/tools.component';
import { ClimateZoneComponent } from './pages/climate-zone/climate-zone.component';
import { MulchCalculatorComponent } from './pages/mulch-calculator/mulch-calculator.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ShopComponent,
    EventsComponent,
    AboutComponent,
    ContactComponent,
    ResourcesComponent,
    CareersComponent,
    DonationsComponent,
    ToolsComponent,
    ClimateZoneComponent,
    MulchCalculatorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
