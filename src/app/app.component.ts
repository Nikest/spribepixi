import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public verticalPadding = 0;

  public REEL_WIDTH: number = 160;
  public SYMBOL_SIZE: number = 150;
  public running = false;
  public columns = 5;
  public rows = 4;
  private reels: any = [];
  private reelContainer: any;
  private bgColor = '#1099bb';
  private slotTextures: any[] = [];

  @ViewChild('mainElem') mainElem!: ElementRef;

  private pixi: PIXI.Application = new PIXI.Application({
    resizeTo: window,
    background: this.bgColor,
  });

  ngAfterViewInit(): void {
    this.mainElem.nativeElement.appendChild(this.pixi.view as unknown as Node);
    this.reelContainer = new PIXI.Container();

    PIXI.Assets.load([
      'https://pixijs.com/assets/eggHead.png',
      'https://pixijs.com/assets/flowerTop.png',
      'https://pixijs.com/assets/helmlok.png',
      'https://pixijs.com/assets/skully.png',
    ]).then(this.onAssetsLoaded);

  }

  private onAssetsLoaded = () => {
    const padding = (this.pixi.screen.width - (this.columns * this.REEL_WIDTH)) / 2;
    this.slotTextures = [
        PIXI.Texture.from('https://pixijs.com/assets/eggHead.png'),
        PIXI.Texture.from('https://pixijs.com/assets/flowerTop.png'),
        PIXI.Texture.from('https://pixijs.com/assets/helmlok.png'),
        PIXI.Texture.from('https://pixijs.com/assets/skully.png'),
    ];

    for (let i = 0; i < this.columns; i++)
    {
        const rc = new PIXI.Container();

        rc.x = i * this.REEL_WIDTH;
        this.reelContainer.addChild(rc);

        const reel = {
            container: rc,
            symbols: [],
            position: 0,
            previousPosition: 0,
            blur: new PIXI.BlurFilter(),
        };

        reel.blur.blurX = 0;
        reel.blur.blurY = 0;
        rc.filters = [reel.blur];

        for (let j = 0; j < this.rows; j++)
        {
            const symbol = new PIXI.Sprite(this.slotTextures[Math.floor(Math.random() * this.slotTextures.length)]);
            
            symbol.y = j * this.SYMBOL_SIZE;
            symbol.scale.x = symbol.scale.y = Math.min(this.SYMBOL_SIZE / symbol.width, this.SYMBOL_SIZE / symbol.height);
            symbol.x = Math.round((this.SYMBOL_SIZE - symbol.width) / 2);
            reel.symbols.push(symbol as unknown as never);
            rc.addChild(symbol);
        }
        this.reels.push(reel);
    }
    this.pixi.stage.addChild(this.reelContainer);

    this.verticalPadding = ((this.pixi.screen.height - this.SYMBOL_SIZE * (this.rows - 1)) / 2);
    console.log(this.pixi.screen.height, this.SYMBOL_SIZE, this.rows, this.reels);
    this.reelContainer.y = this.verticalPadding;
    this.reelContainer.x = padding;

    this.slotsUpdate();
  }

  startPlay = () => {
    if (this.running) return;
    this.running = true;

    for (let i = 0; i < this.reels.length; i++)
    {
      const r = this.reels[i];
      const extra = Math.floor(Math.random() * 3);
      const target = r.position + 10 + i * 5 + extra;
      const time = 2500 + i * 600 + extra * 600;

      this.tweenTo(r, 'position', target, time, 'power3.inOut', this.slotsUpdate, () => {
        this.running = false;
      });
    }
  }

  private slotsUpdate = () => {
    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i];

      r.blur.blurY = (r.position - r.previousPosition) * 8;
      r.previousPosition = r.position;

      for (let j = 0; j < r.symbols.length; j++)
      {
          const s = r.symbols[j];
          const prevy = s.y;

          s.y = ((r.position + j) % r.symbols.length) * this.SYMBOL_SIZE - this.SYMBOL_SIZE;
          if (s.y < 0 && prevy > this.SYMBOL_SIZE)
          {
              s.texture = this.slotTextures[Math.floor(Math.random() * this.slotTextures.length)];
              s.scale.x = s.scale.y = Math.min(this.SYMBOL_SIZE / s.texture.width, this.SYMBOL_SIZE / s.texture.height);
              s.x = Math.round((this.SYMBOL_SIZE - s.width) / 2);
          }
      }
    }
  }

  private tweenTo = (object: any, property: any, target: any, time: any, easing: any, onchange: any, oncomplete: any) => {
    gsap.to(object, {
      [property]: target,
      duration: time / 1000,
      ease: easing,
      onUpdate: onchange,
      onComplete: oncomplete,
  });
  }

  onPlayClick() {
    this.startPlay();
  }
}
