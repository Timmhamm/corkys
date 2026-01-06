import { Component, OnInit } from '@angular/core';

type ShapeType = 'rectangle' | 'square' | 'circle' | 'rectangle-border' | 'circle-border' | 'annulus' | 'triangle' | 'trapezoid';
type Unit = 'in' | 'ft' | 'yd' | 'cm' | 'm';
type PricingMode = 'bulk' | 'bags';

@Component({
  selector: 'app-mulch-calculator',
  templateUrl: './mulch-calculator.component.html',
  styleUrls: ['./mulch-calculator.component.css']
})
export class MulchCalculatorComponent implements OnInit {
  selectedShape: ShapeType = 'rectangle';
  units: Unit = 'ft';
  depthUnit: Unit = 'in';
  pricingMode: PricingMode = 'bulk';
  
  // Rectangle/Square inputs
  length: number = 0;
  width: number = 0;
  
  // Circle inputs
  diameter: number = 0;
  innerDiameter: number = 0;
  borderWidth: number = 0;
  
  // Rectangle Border inputs
  innerLength: number = 0;
  innerWidth: number = 0;
  
  // Triangle inputs
  base: number = 0;
  height: number = 0;
  
  // Trapezoid inputs
  sideA: number = 0;
  sideB: number = 0;
  trapezoidHeight: number = 0;
  
  // Depth
  depth: number = 3;
  
  // Pricing
  selectedMaterial: string = '';
  pricePerUnit: number = 0;
  priceUnit: 'cubic-foot' | 'cubic-yard' | 'cubic-meter' = 'cubic-yard';
  bagSize: number = 2;
  pricePerBag: number = 0;

  // Material options with prices per cubic yard (converted from 1/2 cubic yard prices)
  materials: { category: string; name: string; pricePerCubicYard: number }[] = [
    // Mulch
    { category: 'Mulch', name: 'Brown Mulch', pricePerCubicYard: 38.00 },
    { category: 'Mulch', name: 'Black Mulch', pricePerCubicYard: 38.00 },
    { category: 'Mulch', name: 'Natural Bark Mulch', pricePerCubicYard: 38.00 },
    { category: 'Mulch', name: 'Red Mulch', pricePerCubicYard: 38.00 },
    { category: 'Mulch', name: 'Cedar Mulch', pricePerCubicYard: 50.00 },
    { category: 'Mulch', name: 'Playground Mulch', pricePerCubicYard: 38.00 },
    // Bulk Materials
    { category: 'Bulk Materials', name: 'Topsoil', pricePerCubicYard: 42.00 },
    { category: 'Bulk Materials', name: 'Mushroom Soil', pricePerCubicYard: 42.00 },
    { category: 'Bulk Materials', name: 'Block Sand', pricePerCubicYard: 35.00 },
    { category: 'Bulk Materials', name: 'Mason Sand', pricePerCubicYard: 50.00 },
    // Decorative Stones
    { category: 'Decorative Stones', name: 'Berkshire Stone', pricePerCubicYard: 125.00 },
    { category: 'Decorative Stones', name: 'Pocono River', pricePerCubicYard: 125.00 },
    { category: 'Decorative Stones', name: 'Delaware Stone', pricePerCubicYard: 125.00 },
    { category: 'Decorative Stones', name: 'Cinnamon Stone', pricePerCubicYard: 95.00 },
    { category: 'Decorative Stones', name: 'Grey Stone', pricePerCubicYard: 35.00 },
    { category: 'Decorative Stones', name: 'Modified 2A Stone', pricePerCubicYard: 35.00 },
    { category: 'Decorative Stones', name: 'Maryland Stone', pricePerCubicYard: 150.00 },
    { category: 'Decorative Stones', name: 'Buffalo Stone', pricePerCubicYard: 125.00 },
    { category: 'Decorative Stones', name: 'Local River Stone', pricePerCubicYard: 78.00 },
    { category: 'Decorative Stones', name: 'Red Stone', pricePerCubicYard: 85.00 },
    { category: 'Decorative Stones', name: 'Browndale Stone', pricePerCubicYard: 125.00 },
    { category: 'Decorative Stones', name: 'Antique White Stone', pricePerCubicYard: 85.00 },
  ];

  getMaterialCategories(): string[] {
    const categories = new Set(this.materials.map(m => m.category));
    return Array.from(categories);
  }

  getMaterialsByCategory(category: string): { name: string; pricePerCubicYard: number }[] {
    return this.materials
      .filter(m => m.category === category)
      .map(m => ({ name: m.name, pricePerCubicYard: m.pricePerCubicYard }));
  }

  onMaterialChange(): void {
    if (this.selectedMaterial) {
      const material = this.materials.find(m => m.name === this.selectedMaterial);
      if (material) {
        this.pricePerUnit = material.pricePerCubicYard;
        this.priceUnit = 'cubic-yard';
        this.pricingMode = 'bulk';
        this.calculate();
      }
    }
  }
  
  // Results
  cubicYards: number = 0;
  cubicFeet: number = 0;
  cubicMeters: number = 0;
  cost: number = 0;
  numberOfBags: number = 0;
  minimumPurchase: boolean = false;
  purchaseAmount: number = 0; // Actual amount to purchase (may be minimum)

  constructor() { }

  ngOnInit(): void {
    // Initialize with default calculation
    this.calculate();
  }

  calculate(): void {
    let areaSqFt = 0;
    
    // Convert all inputs to feet for calculation
    const lengthFt = this.convertToFeet(this.length, this.units);
    const widthFt = this.convertToFeet(this.width, this.units);
    const diameterFt = this.convertToFeet(this.diameter, this.units);
    const innerDiameterFt = this.convertToFeet(this.innerDiameter, this.units);
    const borderWidthFt = this.convertToFeet(this.borderWidth, this.units);
    const innerLengthFt = this.convertToFeet(this.innerLength, this.units);
    const innerWidthFt = this.convertToFeet(this.innerWidth, this.units);
    const baseFt = this.convertToFeet(this.base, this.units);
    const heightFt = this.convertToFeet(this.height, this.units);
    const sideAFt = this.convertToFeet(this.sideA, this.units);
    const sideBFt = this.convertToFeet(this.sideB, this.units);
    const trapezoidHeightFt = this.convertToFeet(this.trapezoidHeight, this.units);
    const depthFt = this.convertToFeet(this.depth, this.depthUnit);

    // Calculate area based on shape
    switch (this.selectedShape) {
      case 'rectangle':
        areaSqFt = lengthFt * widthFt;
        break;
        
      case 'square':
        areaSqFt = widthFt * widthFt;
        break;
        
      case 'circle':
        areaSqFt = Math.PI * Math.pow(diameterFt / 2, 2);
        break;
        
      case 'rectangle-border':
        const outerLength = innerLengthFt + (2 * borderWidthFt);
        const outerWidth = innerWidthFt + (2 * borderWidthFt);
        const totalArea = outerLength * outerWidth;
        const innerArea = innerLengthFt * innerWidthFt;
        areaSqFt = totalArea - innerArea;
        break;
        
      case 'circle-border':
      case 'annulus':
        const outerDia = innerDiameterFt + (2 * borderWidthFt);
        const outerArea = Math.PI * Math.pow(outerDia / 2, 2);
        const innerAreaCircle = Math.PI * Math.pow(innerDiameterFt / 2, 2);
        areaSqFt = outerArea - innerAreaCircle;
        break;
        
      case 'triangle':
        areaSqFt = 0.5 * baseFt * heightFt;
        break;
        
      case 'trapezoid':
        areaSqFt = ((sideAFt + sideBFt) / 2) * trapezoidHeightFt;
        break;
    }

    // Calculate volume
    this.cubicFeet = areaSqFt * depthFt;
    this.cubicYards = this.cubicFeet / 27;
    this.cubicMeters = this.cubicFeet * 0.0283168;

    // Check for minimum purchase (0.5 cubic yards for bulk materials)
    this.minimumPurchase = false;
    this.purchaseAmount = this.cubicYards;
    
    if (this.pricingMode === 'bulk' && this.cubicYards < 0.5 && this.cubicYards > 0) {
      this.minimumPurchase = true;
      this.purchaseAmount = 0.5; // Minimum purchase amount
    }

    // Calculate pricing
    if (this.pricingMode === 'bulk') {
      if (this.pricePerUnit > 0) {
        if (this.priceUnit === 'cubic-yard') {
          this.cost = this.purchaseAmount * this.pricePerUnit;
        } else if (this.priceUnit === 'cubic-foot') {
          const purchaseCubicFeet = this.minimumPurchase ? 13.5 : this.cubicFeet; // 0.5 yd³ = 13.5 ft³
          this.cost = purchaseCubicFeet * this.pricePerUnit;
        } else if (this.priceUnit === 'cubic-meter') {
          const purchaseCubicMeters = this.minimumPurchase ? 0.382278 : this.cubicMeters; // 0.5 yd³ = 0.382278 m³
          this.cost = purchaseCubicMeters * this.pricePerUnit;
        }
      } else {
        this.cost = 0;
      }
    } else {
      // Bag pricing (no minimum)
      const cubicFeetPerBag = this.bagSize;
      this.numberOfBags = Math.ceil(this.cubicFeet / cubicFeetPerBag);
      this.cost = this.numberOfBags * this.pricePerBag;
      this.minimumPurchase = false;
      this.purchaseAmount = this.cubicYards;
    }
  }

  convertToFeet(value: number, unit: Unit): number {
    switch (unit) {
      case 'in':
        return value / 12;
      case 'ft':
        return value;
      case 'yd':
        return value * 3;
      case 'cm':
        return value * 0.0328084;
      case 'm':
        return value * 3.28084;
      default:
        return value;
    }
  }

  onShapeChange(): void {
    // Reset relevant fields when shape changes
    this.calculate();
  }

  getShapeName(shape: ShapeType): string {
    const names: { [key in ShapeType]: string } = {
      'rectangle': 'Rectangle',
      'square': 'Square',
      'circle': 'Circle',
      'rectangle-border': 'Rectangle Border',
      'circle-border': 'Circle Border',
      'annulus': 'Annulus',
      'triangle': 'Triangle',
      'trapezoid': 'Trapezoid'
    };
    return names[shape];
  }
}
