import { Input, Component } from "@angular/core";
import {
  IconProp,
  SizeProp,
  RotateProp,
} from "@fortawesome/fontawesome-svg-core";

/**
 * Fontawesome icon.
 */
@Component({
  selector: "sam-icon",
  template: `<sam-fa-icon
    [icon]="icon"
    [title]="title"
    [spin]="spin"
    [size]="size"
    [fixedWidth]="fixedWidth"
    [rotate]="rotate"
  >
  </sam-fa-icon>`,
  standalone: false,
})
export class SamIconComponent {
  @Input() icon: IconProp;
  @Input() title?: string;
  @Input() spin?: boolean;
  //@Input() pulse?: boolean;
  //@Input() mask?: IconProp;
  //@Input() styles?: Styles;
  //@Input() flip?: FlipProp;
  @Input() size?: SizeProp;
  //@Input() pull?: PullProp;
  //@Input() border?: boolean;
  //@Input() inverse?: boolean;
  //@Input() symbol?: FaSymbol;
  //@Input() listItem?: boolean;
  @Input() rotate?: RotateProp;
  @Input() fixedWidth?: boolean;
  //@Input() classes?: string[] = [];
  //@Input() transform?: string | Transform;
}
