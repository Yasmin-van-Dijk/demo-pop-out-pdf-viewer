import { NgIf } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-pop-out-window',
  standalone: true,
  imports: [NgIf],
  templateUrl: './pop-out-window.component.html',
  styleUrl: './pop-out-window.component.scss',
})
export class PopOutWindowComponent implements OnDestroy {
  #renderer2 = inject(Renderer2);
  #elementRef = inject(ElementRef);
  #changeDetectorRef = inject(ChangeDetectorRef);

  #popOutWindow: Window | null = null;
  #unloadListener: () => void = () => {};
  #unloadListenerSet = false;

  public windowIsPoppedOut = false;

  @ViewChild('popOutWindowWrapper', { static: true }) popOutWindowWrapper: any;

  ngOnDestroy(): void {
    if (this.#unloadListenerSet) {
      this.#unloadListener();
    }
    this.#closePopout();
  }

  @HostListener('window:beforeunload')
  private beforeunloadHandler(): void {
    this.#closePopout();
  }

  public openPopOutWindow(): void {
    if (!this.#popOutWindow) {
      this.#popOutWindow = window.open('', '#blank', 'popup');

      if (this.#popOutWindow) {
        this.#popOutWindow.document.dir = 'ltr';
        this.#popOutWindow.document.body.style.margin = '1rem';
      }

      this.#appendStylesAndStylesheets();
      this.#appendContentToPopOut();
      this.#listenForUnloadAndClose();
    } else {
      this.#popOutWindow.focus();
    }
  }

  public closePopOutWindow(): void {
    this.#renderer2.appendChild(
      this.#elementRef.nativeElement,
      this.popOutWindowWrapper.nativeElement
    );

    this.#closePopout();
  }

  #closePopout(): void {
    if (this.#popOutWindow) {
      this.#popOutWindow.close();
      this.#popOutWindow = null;
      this.windowIsPoppedOut = false;
    }
  }

  #appendStylesAndStylesheets(): void {
    document.head.querySelectorAll('link[rel="stylesheet"]').forEach((node) => {
      if (this.#popOutWindow) {
        this.#popOutWindow.document.head.insertAdjacentHTML(
          'beforeend',
          `<link rel="stylesheet" type="${
            (node as HTMLLinkElement).type
          }" href="${(node as HTMLLinkElement).href}">`
        );
      }
    });
    document.head.querySelectorAll('style').forEach((node) => {
      if (this.#popOutWindow) {
        this.#popOutWindow.document.head.appendChild(node.cloneNode(true));
      }
    });
  }

  #appendContentToPopOut(): void {
    if (this.#popOutWindow) {
      this.#renderer2.appendChild(
        this.#popOutWindow.document.body,
        this.popOutWindowWrapper.nativeElement
      );
    }
    this.windowIsPoppedOut = true;
    this.#changeDetectorRef.detectChanges();
  }

  #listenForUnloadAndClose(): void {
    this.#unloadListener = this.#renderer2.listen(
      this.#popOutWindow,
      'unload',
      () => {
        this.closePopOutWindow();
        this.#changeDetectorRef.detectChanges();
      }
    );
    this.#unloadListenerSet = true;
  }
}
