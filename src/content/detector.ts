import { FIELD_MAP, FieldMatcher } from '../shared/fieldMap';
import { FieldKey } from '../storage/types';
import { DetectedField } from '../shared/messages';
import { nanoid } from 'nanoid';

function scoreField(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, matcher: FieldMatcher): number {
  let score = 0;
  
  const attrs = [
    el.name?.toLowerCase(),
    el.id?.toLowerCase(),
    (el as HTMLInputElement).placeholder?.toLowerCase(),
    el.getAttribute('aria-label')?.toLowerCase(),
    el.getAttribute('autocomplete')?.toLowerCase(),
    el.closest('label')?.textContent?.toLowerCase(),
    document.querySelector(`label[for="${el.id}"]`)?.textContent?.toLowerCase(),
  ].filter(Boolean) as string[];

  // autocomplete attribute match = strongest signal (score: 40)
  if (matcher.autocomplete.some(ac => attrs.includes(ac))) score += 40;

  // input type match (score: 10)
  if (matcher.types.includes(el.type)) score += 10;

  // keyword match in any attribute (score: 20 per match, capped at 40)
  const keywordHits = matcher.keywords.filter(kw =>
    attrs.some(attr => attr.includes(kw))
  ).length;
  score += Math.min(keywordHits * 20, 40);

  // aria-label exact match (score: 30)
  const ariaLabel = el.getAttribute('aria-label')?.toLowerCase() ?? '';
  if (matcher.ariaLabels.some(al => ariaLabel.includes(al))) score += 30;

  return score;
}

export function detectFields(): DetectedField[] {
  const inputs = Array.from(document.querySelectorAll('input, select, textarea')) as (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)[];
  
  const detected: DetectedField[] = [];
  const skipTypes = ['hidden', 'password', 'submit', 'button', 'reset', 'file', 'checkbox', 'radio'];

  for (const el of inputs) {
    if (skipTypes.includes(el.type)) continue;
    if ((el as HTMLInputElement).readOnly || el.disabled) continue;
    
    const autocomplete = el.getAttribute('autocomplete');
    if (autocomplete === 'off' || autocomplete === 'new-password') continue;
    if (el.style.display === 'none' || el.style.visibility === 'hidden') continue;

    let bestMatch: { key: FieldKey | null, score: number } = { key: null, score: 0 };
    
    for (const [key, matcher] of Object.entries(FIELD_MAP)) {
      const score = scoreField(el, matcher as FieldMatcher);
      if (score > bestMatch.score) {
        bestMatch = { key: key as FieldKey, score };
      }
    }

    if (bestMatch.score >= 30 && bestMatch.key) {
      if (!el.dataset.quillId) {
        el.dataset.quillId = nanoid();
      }
      
      const labelText = el.closest('label')?.textContent?.trim() || 
                        document.querySelector(`label[for="${el.id}"]`)?.textContent?.trim() ||
                        el.getAttribute('aria-label') ||
                        (el as HTMLInputElement).placeholder ||
                        el.name || 
                        bestMatch.key;
                        
      detected.push({
        key: bestMatch.key,
        label: labelText,
        score: bestMatch.score,
        elementId: el.dataset.quillId,
      });
    }
  }

  return detected;
}
