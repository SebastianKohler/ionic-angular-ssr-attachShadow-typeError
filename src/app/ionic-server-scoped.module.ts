import { DOCUMENT } from '@angular/common';
import { APP_ID, NgModule } from '@angular/core';
import { BEFORE_APP_SERIALIZED } from '@angular/platform-server';
import { hydrateDocument } from '@ionic/core/hydrate';

@NgModule({
  providers: [
    {
      provide: BEFORE_APP_SERIALIZED,
      useFactory: hydrateIonicComponentsScoped,
      multi: true,
      deps: [DOCUMENT, APP_ID],
    },
  ],
})
export class IonicServerScopedModule {}

export function hydrateIonicComponentsScoped(doc: Document, appId: string) {
  return () => {
    ensureAttachShadow(doc);

    return hydrateDocument(doc, {
      clientHydrateAnnotations: true,
      serializeShadowRoot: 'scoped',
      excludeComponents: [
        // overlays
        'ion-action-sheet',
        'ion-alert',
        'ion-loading',
        'ion-modal',
        'ion-picker-legacy',
        'ion-popover',
        'ion-toast',
        'ion-toast',

        // navigation
        'ion-router',
        'ion-route',
        'ion-route-redirect',
        'ion-router-link',
        'ion-router-outlet',

        // tabs
        'ion-tabs',
        'ion-tab',

        // auxiliary
        'ion-picker-legacy-column',
      ],
    }).then((hydrateResults) => {
      hydrateResults.diagnostics.forEach((diagnostic) => {
        if (diagnostic.type === 'error') {
          console.error(diagnostic.messageText);
        } else if (diagnostic.type === 'debug') {
          console.debug(diagnostic.messageText);
        } else {
          console.log(diagnostic.messageText);
        }
      });

      if (doc.head != null) {
        const styleElms = doc.head.querySelectorAll(
          'style[data-styles]'
        ) as NodeListOf<HTMLStyleElement>;
        for (let i = 0; i < styleElms.length; i++) {
          styleElms[i].setAttribute('ng-transition', appId);
        }
      }

      if (doc.body != null) {
        const ionPages = doc.body.querySelectorAll(
          '.ion-page.ion-page-invisible'
        ) as NodeListOf<HTMLElement>;
        for (let i = 0; i < ionPages.length; i++) {
          ionPages[i].classList.remove('ion-page-invisible');
        }
      }
    });
  };
}

function ensureAttachShadow(doc: Document): void {
  const probe = doc.createElement('div') as Element & {
    attachShadow?: (init: ShadowRootInit) => unknown;
    shadowRoot?: unknown;
  };
  const proto = Object.getPrototypeOf(probe) as {
    attachShadow?: (init: ShadowRootInit) => unknown;
  } | null;

  if (!proto || typeof proto.attachShadow === 'function') {
    return;
  }

  Object.defineProperty(proto, 'attachShadow', {
    configurable: true,
    writable: true,
    value: function attachShadowShim(this: { shadowRoot?: unknown }) {
      if (this.shadowRoot != null) {
        return this.shadowRoot;
      }

      const shadowRoot = doc.createDocumentFragment();
      Object.defineProperty(this, 'shadowRoot', {
        configurable: true,
        writable: true,
        value: shadowRoot,
      });
      return shadowRoot;
    },
  });
}
