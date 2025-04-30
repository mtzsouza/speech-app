import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../../utils/ui/cn';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule],
  template: `<div [class]="cardClass"><ng-content></ng-content></div>`
})
export class CardComponent {
  @Input() class: string = '';

  get cardClass(): string {
    return cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      this.class
    );
  }
}

@Component({
  selector: 'ui-card-header',
  standalone: true,
  imports: [CommonModule],
  template: `<div [class]="headerClass"><ng-content></ng-content></div>`
})
export class CardHeaderComponent {
  @Input() class: string = '';

  get headerClass(): string {
    return cn('flex flex-col space-y-1.5 p-6', this.class);
  }
}

@Component({
  selector: 'ui-card-title',
  standalone: true,
  imports: [CommonModule],
  template: `<h3 [class]="titleClass"><ng-content></ng-content></h3>`
})
export class CardTitleComponent {
  @Input() class: string = '';

  get titleClass(): string {
    return cn('text-2xl font-semibold leading-none tracking-tight', this.class);
  }
}

@Component({
  selector: 'ui-card-description',
  standalone: true,
  imports: [CommonModule],
  template: `<p [class]="descriptionClass"><ng-content></ng-content></p>`
})
export class CardDescriptionComponent {
  @Input() class: string = '';

  get descriptionClass(): string {
    return cn('text-sm text-muted-foreground', this.class);
  }
}

@Component({
  selector: 'ui-card-content',
  standalone: true,
  imports: [CommonModule],
  template: `<div [class]="contentClass"><ng-content></ng-content></div>`
})
export class CardContentComponent {
  @Input() class: string = '';

  get contentClass(): string {
    return cn('p-6 pt-0', this.class);
  }
}

@Component({
  selector: 'ui-card-footer',
  standalone: true,
  imports: [CommonModule],
  template: `<div [class]="footerClass"><ng-content></ng-content></div>`
})
export class CardFooterComponent {
  @Input() class: string = '';

  get footerClass(): string {
    return cn('flex items-center p-6 pt-0', this.class);
  }
}