// @flow
import Toast from './toast';
import ToastrManager from './manager';

import type {
  StoreProps as ToastProps,
  Actions as ToastActions } from './toast';
import type {
  ToastType as ToastValue,
  StoreProps as ToastrManagerProps,
  Actions as ToastrManagerActions } from './manager';

export {
  Toast,
  ToastrManager,
};

export type {
  ToastActions,
  ToastProps,
  ToastValue,
  ToastrManagerActions,
  ToastrManagerProps,
};
