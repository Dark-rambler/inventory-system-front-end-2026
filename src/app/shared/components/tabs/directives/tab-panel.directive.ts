import { Directive, Input, TemplateRef, inject } from '@angular/core';

export interface TabPanelContext {
  $implicit: string;
  active: boolean;
}

@Directive({
  selector: 'ng-template[appTabPanel]',
  standalone: true,
})
export class TabPanelDirective {
  @Input('appTabPanel') public tabId!: string;
  @Input({ required: true }) public tabLabel!: string;
  @Input() public tabDisabled = false;
  @Input() public tabBadge: string | number | null = null;

  public readonly template = inject<TemplateRef<TabPanelContext>>(TemplateRef);
}
