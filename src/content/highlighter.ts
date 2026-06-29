export function highlightField(el: HTMLElement): void {
  const prevOutline = el.style.outline;
  const prevOutlineOffset = el.style.outlineOffset;
  
  el.style.outline = '2px solid #378ADD';
  el.style.outlineOffset = '2px';
  
  setTimeout(() => {
    el.style.outline = prevOutline;
    el.style.outlineOffset = prevOutlineOffset;
  }, 1500);
}
