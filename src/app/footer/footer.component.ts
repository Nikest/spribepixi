import {
  Component,
  Input,
  SimpleChanges,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import * as PIXI from 'pixi.js';
import { mainTextStyle } from '../../utils/graphicTextStyles';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  public title: string = '';

  @Input() height: number = 0;
  @ViewChild('buttonElem') buttonElem!: ElementRef;
  @Output() playClick = new EventEmitter<void>();

  private pixi: PIXI.Application = new PIXI.Application({
    background: '#000',
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['height'] && changes['height'].currentValue !== 0) {
      this.title = this.buttonElem.nativeElement.innerText;
      this.buttonElem.nativeElement.innerText = '';

      this.pixi = new PIXI.Application({
        background: '#000',
        width: window.innerWidth,
        height: this.height,
      });
    
      this.buttonElem.nativeElement.appendChild(this.pixi.view as unknown as Node);
      this.renderText();
    }
  }

  renderText() {
    const rect = new PIXI.Graphics();

    rect.beginFill(0, 1);
    rect.drawRect(0, 0, this.pixi.screen.width, this.height);

    const style = new PIXI.TextStyle(mainTextStyle);

    const footerText = new PIXI.Text(this.title, style);

    footerText.x = Math.round((rect.width - footerText.width) / 2);
    footerText.y = Math.round((this.height - footerText.height) / 2);
    rect.addChild(footerText);

    this.pixi.stage.addChild(rect);
  }

  onButtonClick() {
    this.playClick.emit();
  }
}
