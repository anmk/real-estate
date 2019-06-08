import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDropZone]'
})
export class DropZoneDirective {

  @Output() dropped =  new EventEmitter<FileList>();
  @Output() hovered =  new EventEmitter<boolean>();

  @HostListener('drop', ['$event'])
  onDrop($event): void {
    $event.preventDefault();
    this.dropped.emit($event.dataTransfer.files);
    this.hovered.emit(false);
  }

  @HostListener('dragover', ['$event'])
  onDragOver($event): void {
    $event.preventDefault();
    this.hovered.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave($event): void {
    $event.preventDefault();
    this.hovered.emit(false);
  }

}
