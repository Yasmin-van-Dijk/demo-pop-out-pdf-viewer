import { Component } from '@angular/core';
import {
  NgxExtendedPdfViewerModule,
  pdfDefaultOptions,
} from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [NgxExtendedPdfViewerModule],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.scss',
})
export class PdfViewerComponent {
  public constructor() {
    pdfDefaultOptions.enableScripting = false;
    pdfDefaultOptions.assetsFolder = 'assets/ngx-pdf';
  }
}
