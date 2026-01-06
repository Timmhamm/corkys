import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'gift-cards', component: ShopComponent }, // Temporary: redirect to shop
  { path: 'tools', component: ToolsComponent },
  { path: 'tools/climate-zone', component: ClimateZoneComponent },
  { path: 'tools/mulch-calculator', component: MulchCalculatorComponent },
  { path: 'events', component: EventsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'resources', component: ResourcesComponent },
  { path: 'resources/careers', component: CareersComponent },
  { path: 'resources/donations', component: DonationsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
