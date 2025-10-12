import type routeType from 'ziggy-js';

declare global {
  const route: typeof routeType;
  interface Window {
    Ziggy: any;
    route: typeof routeType;
  }
}
export {};
