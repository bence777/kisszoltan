export function track(name, properties = {}) {
  if (typeof window === 'undefined') return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...properties });
  } catch (_) { /* tracking must never block conversion */ }
}
