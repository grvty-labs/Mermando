// @flow
import Lightbox from './lightbox';
import Modal from './modal';
import Page from './page';
import TabbedPage from './tabbed';

import type {
  StoreProps as PageProps,
  Actions as PageActions,
} from './page';
import type {
  Zone as TabbedPageZone,
  StoreProps as TabbedPageProps,
  Actions as TabbedPageActions,
} from './tabbed';

export {
  Lightbox,
  Modal,
  Page,
  TabbedPage,
};

export type {
  PageProps,
  PageActions,
  TabbedPageProps,
  TabbedPageActions,
  TabbedPageZone,
};
