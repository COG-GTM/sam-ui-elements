import { Component, Input } from "@angular/core";

@Component({
  selector: "sam-header-nav",
  template: `
    <ul
      [ngClass]="{
        'usa-nav__primary usa-accordion': type === 'primary',
        'usa-nav__secondary-links': type === 'secondary',
      }"
    >
      <ng-content></ng-content>
    </ul>
  `,
  standalone: false,
})
export class SamHeaderNavComponent {
  @Input() type: string;
}
