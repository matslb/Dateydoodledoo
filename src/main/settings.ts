import Store from 'electron-store';
import { Settings } from '../shared/types.js';

const store = new Store<Settings>({
  defaults: {
    rootDestinationFolder: '',
    deleteOriginals: false,
  },
});

export const getSettings = (): Settings => {
  return store.store;
};

export const saveSettings = (settings: Partial<Settings>): void => {
  store.set(settings);
};

export const getRootDestinationFolder = (): string => {
  return store.get('rootDestinationFolder', '');
};

export const setRootDestinationFolder = (path: string): void => {
  store.set('rootDestinationFolder', path);
};

export const getDeleteOriginals = (): boolean => {
  return store.get('deleteOriginals', false);
};

export const setDeleteOriginals = (value: boolean): void => {
  store.set('deleteOriginals', value);
};
