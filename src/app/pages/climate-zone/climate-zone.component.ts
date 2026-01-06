import { Component, OnInit } from '@angular/core';

interface State {
  [key: string]: string;
}

interface ZoneInfo {
  State: string;
  "State FIPS": string;
  "County FIPS": string | number;
  "IECC Climate Zone": number;
  "IECC Moisture Regime": string;
  "BA Climate Zone": string;
  "County Name": string;
}

@Component({
  selector: 'app-climate-zone',
  templateUrl: './climate-zone.component.html',
  styleUrls: ['./climate-zone.component.css']
})
export class ClimateZoneComponent implements OnInit {
  states: State = {};
  zones: ZoneInfo[] = [];
  selectedState: string = '';
  selectedCounty: string = '';
  availableCounties: string[] = [];
  result: ZoneInfo | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor() { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    
    // Load states
    fetch('/assets/data/states.json')
      .then(res => res.json())
      .then(data => {
        this.states = data;
        this.isLoading = false;
      })
      .catch(err => {
        console.error('Error loading states:', err);
        this.errorMessage = 'Failed to load states data';
        this.isLoading = false;
      });

    // Load zones
    fetch('/assets/data/zones.json')
      .then(res => res.json())
      .then(data => {
        this.zones = data;
        this.isLoading = false;
      })
      .catch(err => {
        console.error('Error loading zones:', err);
        this.errorMessage = 'Failed to load zones data';
        this.isLoading = false;
      });
  }

  onStateChange(): void {
    this.selectedCounty = '';
    this.result = null;
    this.availableCounties = [];
    
    if (this.selectedState) {
      // Get unique counties for the selected state
      const counties = this.zones
        .filter(zone => zone.State === this.selectedState)
        .map(zone => zone["County Name"])
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort();
      
      this.availableCounties = counties;
    }
  }

  onCountyChange(): void {
    this.result = null;
    
    if (this.selectedState && this.selectedCounty) {
      const match = this.zones.find(zone => 
        zone.State === this.selectedState && 
        zone["County Name"] === this.selectedCounty
      );
      
      if (match) {
        this.result = match;
      }
    }
  }

  useLocation(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.result = null;

    if (!navigator.geolocation) {
      this.errorMessage = 'Geolocation is not supported by your browser';
      this.isLoading = false;
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        fetch(`https://geo.fcc.gov/api/census/area?lat=${lat}&lon=${lon}&censusYear=2020&format=json`)
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then(data => {
            if (data.results && data.results.length > 0) {
              const county = data.results[0].county_name;
              const state = data.results[0].state_name;
              
              // Find state code
              const stateCode = Object.keys(this.states).find(key => 
                this.states[key] === state
              );

              if (stateCode) {
                this.selectedState = stateCode;
                this.onStateChange();
                
                // Match county (handle cases where county name might have additional words)
                const countyName = county.split(' ')[0];
                const match = this.zones.find(zone => 
                  zone.State === stateCode && 
                  zone["County Name"].startsWith(countyName)
                );

                if (match) {
                  this.selectedCounty = match["County Name"];
                  this.result = match;
                } else {
                  this.errorMessage = `Could not find climate zone data for ${county}, ${state}. Please select your county manually.`;
                }
              } else {
                this.errorMessage = `Could not find state code for ${state}. Please select your state manually.`;
              }
            } else {
              this.errorMessage = 'Could not determine your location. Please select your state and county manually.';
            }
            this.isLoading = false;
          })
          .catch(err => {
            console.error('Error fetching location data:', err);
            if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('CORS')) {
              this.errorMessage = 'Location detection is not available due to browser security restrictions. Please use the dropdown menus below to select your state and county.';
            } else if (err.message.includes('HTTP error')) {
              this.errorMessage = 'Location service error. Please select your state and county manually.';
            } else {
              this.errorMessage = 'Unable to detect location. Please select your state and county using the dropdown menus below.';
            }
            this.isLoading = false;
          });
      },
      (err) => {
        console.error('Geolocation error:', err);
        this.errorMessage = 'Failed to get your location. Please select your state and county manually.';
        this.isLoading = false;
      },
      options
    );
  }

  getStateKeys(): string[] {
    return Object.keys(this.states).sort((a, b) => 
      this.states[a].localeCompare(this.states[b])
    );
  }
}
