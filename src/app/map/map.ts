import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapDisplay } from '../../lib/map';

@Component({
  selector: 'app-map',
  templateUrl: './map.html',
  styleUrl: './map.scss',
  imports: [],
})
export class MapComponent implements AfterViewInit {
  @ViewChild('canvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    const canvas = this.canvas.nativeElement;
    if (!canvas) {
      console.error("failed to get canvas")
      return
    }

    MapDisplay.capture(canvas).then((map) => {
      map.test();
    });
  }
}
