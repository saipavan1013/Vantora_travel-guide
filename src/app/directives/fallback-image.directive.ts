import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { ImageService } from '../services/image.service';

@Directive({
    selector: 'img[appFallbackImage]',
    standalone: true
})
export class FallbackImageDirective {
    @Input() appFallbackImage?: string;

    constructor(private el: ElementRef, private imageService: ImageService) { }

    @HostListener('error')
    onError() {
        const img: HTMLImageElement = this.el.nativeElement;
        // Use a varied fallback based on alt text to prevent identical duplicate icons on failure
        const fallback = this.appFallbackImage || this.imageService.getVariedFallback(img.alt || img.src);

        if (img.src !== fallback) {
            img.src = fallback;
        }
    }
}
