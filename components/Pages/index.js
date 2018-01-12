// @flow
import Modal from './modal';
import Page from './page';
import Sticky from './sticky';
import TabbedPage from './tabbed';

import type {
  StoreProps as PageProps,
  Actions as PageActions,
} from './page';
import type {
  StoreProps as StickyProps,
  Actions as StickyActions,
} from './sticky';
import type {
  Zone as TabbedPageZone,
  StoreProps as TabbedPageProps,
  Actions as TabbedPageActions,
} from './tabbed';

export {
  Modal,
  Page,
  TabbedPage,
  Sticky,
};

export type {
  PageProps,
  PageActions,
  StickyProps,
  StickyActions,
  TabbedPageProps,
  TabbedPageActions,
  TabbedPageZone,
};
