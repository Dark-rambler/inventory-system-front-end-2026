import { NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  DestroyRef,
  QueryList,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { TabPanelDirective } from './directives/tab-panel.directive';
import { TabBadgePipe } from './pipes/tab-badge.pipe';
import { TabButtonClassPipe } from './pipes/tab-button-class.pipe';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [NgTemplateOutlet, TabButtonClassPipe, TabBadgePipe],
  templateUrl: './tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent implements AfterContentInit {
  public ariaLabel = input<string>('Navegacion por secciones');
  public defaultTabId = input<string | null>(null);
  public tabChange = output<string>();

  private readonly _destroyRef = inject(DestroyRef);

  @ContentChildren(TabPanelDirective)
  private readonly _tabPanelsQuery!: QueryList<TabPanelDirective>;

  private readonly _tabPanels = signal<readonly TabPanelDirective[]>([]);

  protected readonly tabPanels = computed(() => this._tabPanels());
  protected readonly activeTabId = signal<string | null>(null);

  protected readonly activePanel = computed(() => {
    const activeTabId = this.activeTabId();
    if (!activeTabId) {
      return null;
    }

    return this.tabPanels().find(panel => panel.tabId === activeTabId) ?? null;
  });

  public ngAfterContentInit(): void {
    this._tabPanelsQuery.changes
      .pipe(startWith(this._tabPanelsQuery), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => this._syncPanels());
  }

  protected selectTab(tabId: string): void {
    const panel = this.tabPanels().find(item => item.tabId === tabId);
    if (!panel || panel.tabDisabled || this.activeTabId() === panel.tabId) {
      return;
    }

    this.activeTabId.set(panel.tabId);
    this.tabChange.emit(panel.tabId);
  }

  private _syncPanels(): void {
    const panels = this._tabPanelsQuery.toArray();
    this._tabPanels.set(panels);

    const nextTabId = this._resolveNextTab(panels);
    if (nextTabId !== this.activeTabId()) {
      this.activeTabId.set(nextTabId);
    }
  }

  private _resolveNextTab(panels: readonly TabPanelDirective[]): string | null {
    if (!panels.length) {
      return null;
    }

    const currentTabId = this.activeTabId();
    const activePanel = panels.find(panel => panel.tabId === currentTabId && !panel.tabDisabled);
    if (activePanel) {
      return activePanel.tabId;
    }

    const configuredTabId = this.defaultTabId();
    if (configuredTabId) {
      const configuredPanel = panels.find(
        panel => panel.tabId === configuredTabId && !panel.tabDisabled
      );

      if (configuredPanel) {
        return configuredPanel.tabId;
      }
    }

    return panels.find(panel => !panel.tabDisabled)?.tabId ?? null;
  }
}
