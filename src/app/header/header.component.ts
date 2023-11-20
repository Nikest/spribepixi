import {
  Component,
  Input,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import * as PIXI from 'pixi.js';
import { mainTextStyle } from '../../utils/graphicTextStyles';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public title: string = '';

  @Input() height: number = 0;
  @ViewChild('headerElem') headerElem!: ElementRef;

  private pixi: PIXI.Application = new PIXI.Application({
    background: '#000',
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['height'] && changes['height'].currentValue !== 0) {
      this.title = this.headerElem.nativeElement.innerText;
      this.headerElem.nativeElement.innerText = '';

      this.pixi = new PIXI.Application({
        background: '#000',
        width: window.innerWidth,
        height: this.height,
      });
    
      this.headerElem.nativeElement.appendChild(this.pixi.view as unknown as Node);
      this.renderText();
    }
  }

  renderText() {
    const rect = new PIXI.Graphics();

    rect.beginFill(0, 1);
    rect.drawRect(0, 0, this.pixi.screen.width, this.height);

    const style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#00ff99'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440,
    });

    const headerText = new PIXI.Text(this.title, style);

    headerText.x = Math.round((rect.width - headerText.width) / 2);
    headerText.y = Math.round((this.height - headerText.height) / 2);
    rect.addChild(headerText);

    this.pixi.stage.addChild(rect);
  }
}
