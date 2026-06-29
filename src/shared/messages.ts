import { FieldKey } from '../storage/types';

export interface DetectedField {
  key: FieldKey;
  label: string;        // human-readable label for display in popup
  score: number;        // confidence score
  elementId: string;    // generated id to re-locate the element
}

export type Message =
  | { type: 'DETECT_FIELDS' }
  | { type: 'FIELDS_DETECTED'; payload: DetectedField[] }
  | { type: 'FILL_FORM'; payload: { profileId: string } }
  | { type: 'FILL_RESULT'; payload: { filled: number; skipped: number } }
  | { type: 'UNDO_FILL' }
  | { type: 'UNDO_DONE' };
