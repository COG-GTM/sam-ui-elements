/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Directive, ElementRef, Input, inject } from "@angular/core";
import {
  CanDisable,
  mixinDisabled,
} from "../patterns/layout/components/core/common-behaviors/disabled";

// Boilerplate for applying mixins to MdTabLabelWrapper.
/** @docs-private */
export class MdTabLabelWrapperBase {}
export const _MdTabLabelWrapperMixinBase = mixinDisabled(MdTabLabelWrapperBase);

/**
 * Used in the `md-tab-group` view to display tab labels.
 * @docs-private
 */
@Directive({
  selector: "[md-tab-label-wrapper], [mat-tab-label-wrapper]",
  host: {
    "[class.mat-tab-disabled]": "disabled",
  },
  standalone: false,
})
export class MdTabLabelWrapper
  extends _MdTabLabelWrapperMixinBase
  implements CanDisable
{
  elementRef = inject(ElementRef);

  /** Whether the tab is disabled; delegates to the `mixinDisabled` accessor. */
  @Input()
  get disabled(): boolean {
    return super.disabled;
  }
  set disabled(value: boolean) {
    super.disabled = value;
  }

  /** Sets focus on the wrapper element */
  focus(): void {
    this.elementRef.nativeElement.focus();
  }

  getOffsetLeft(): number {
    return this.elementRef.nativeElement.offsetLeft;
  }

  getOffsetWidth(): number {
    return this.elementRef.nativeElement.offsetWidth;
  }
}
