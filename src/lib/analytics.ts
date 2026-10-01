// Mock analytics tracking for pre-launch checklist

export const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
  // In a real app, this would send data to Google Analytics, Mixpanel, PostHog, etc.
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Analytics Event]: ${eventName}`, eventData || {});
  }
};

export const trackPageView = (pageName: string) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Analytics PageView]: ${pageName}`);
  }
};
