import { Component, Input } from "@angular/core";

@Component({
  selector: "sam-footer-nav",
  template: `
    <span class="usa-footer__primary-link">{{ title }}</span>
    <ul class="usa-list usa-list--unstyled">
      <ng-content></ng-content>
    </ul>
  `,
  standalone: false,
})
export class SamFooterNavComponent {
  @Input() title: string;
}
