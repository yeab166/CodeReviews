import { Slice } from "../wheeloffortune/page";


export type SliceWithoutTarget = Omit<Slice, 'target' | 'bonus'> & {
    double: boolean
  }

export const startingSlices: SliceWithoutTarget[] = [
  { color: '#ff5f42', label: 'Double', value: 0, double: true },
  { color: 'var(--one)', label: '25', value: 25, double: false },
  { color: 'var(--two)', label: '50', value: 50, double: false },
  { color: 'var(--ten)', label: '75', value: 75, double: false },
  { color: 'var(--pch)', label: '100', value: 100, double: false },
  { color: '#ff5f42', label: 'Double', value: 0, double: true },
  { color: 'var(--five)', label: '150', value: 150, double: false },
  { color: 'var(--one)', label: '25', value: 25, double: false },
  { color: 'var(--two)', label: '50', value: 50, double: false },
  { color: 'var(--ten)', label: '75', value: 75, double: false },
  { color: '#ff5f42', label: 'Double', value: 0, double: true },
  { color: 'var(--pch)', label: '100', value: 100, double: false },
  { color: 'var(--five)', label: '150', value: 150, double: false },
  { color: 'var(--one)', label: '25', value: 25, double: false },
  { color: 'var(--two)', label: '50', value: 50, double: false },
  { color: '#ff5f42', label: 'Double', value: 0, double: true },
  { color: 'var(--ten)', label: '75', value: 75, double: false },
  { color: 'var(--pch)', label: '100', value: 100, double: false },
  { color: 'var(--five)', label: '150', value: 150, double: false },
  { color: 'var(--one)', label: '25', value: 25, double: false },
  { color: '#ff5f42', label: 'Double', value: 0, double: true },
  { color: 'var(--two)', label: '50', value: 50, double: false },
  { color: 'var(--ten)', label: '75', value: 75, double: false },
  { color: 'var(--pch)', label: '100', value: 100, double: false },
  { color: 'var(--one)', label: '25', value: 25, double: false }
];
