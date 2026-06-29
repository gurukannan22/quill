export function fillField(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, value: string): boolean {
  try {
    el.focus();

    let setter: PropertyDescriptor | undefined;
    
    if (el instanceof HTMLInputElement) {
      setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    } else if (el instanceof HTMLTextAreaElement) {
      setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
    } else if (el instanceof HTMLSelectElement) {
      setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value')?.set;
    }

    if (setter) {
      setter.call(el, value);
    } else {
      el.value = value;
    }

    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));

    el.blur();
    
    return el.value === value;
  } catch (e) {
    console.error('Failed to fill field', el, e);
    return false;
  }
}
