import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TranslateModule } from '@ngx-translate/core';
import { MapService } from '../../services/map-service';
import { RadioButtonModule } from 'primeng/radiobutton';
@Component({
  selector: 'map-legend-control',
  templateUrl: './map-legend-control.component.html',
  styleUrls: ['./map-legend-control.component.scss'],
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    CardModule,
    TranslateModule,
    RadioButtonModule
  ]
})
export class MapLegendControlComponent {

  constructor(
    public mapService: MapService
  ) { }

  public baseLayers = [
    {
      key: 'scheme',
      name: 'Яндекс Карта'
    },
    {
      key: 'hybrid',
      name: 'Яндекс Спутник'
    }
  ];

  public selectedBaseLayer: any = 'scheme';

  public onBaseLayerChange(value: any): void {
    this.mapService.baseLayer$.next(value);
  }
}
