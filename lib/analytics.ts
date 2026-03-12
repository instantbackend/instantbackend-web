type AnalyticsValue = string | number | boolean | null | undefined;

type DataLayerEvent = {
  event: string;
} & Record<string, AnalyticsValue>;

type WindowWithDataLayer = Window & {
  dataLayer?: DataLayerEvent[];
};

export function trackEvent(event: string, params: Record<string, AnalyticsValue> = {}): void {
  if (typeof window === "undefined") return;

  const win = window as WindowWithDataLayer;
  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push({ event, ...params });
}
