// ─── Donors Data ─────────────────────────────────────────────
// Top supporters — ranked by amount (descending) at render time.
// Update amounts here; the UI re-sorts automatically.

export interface Donor {
  name: string;
  /** Amount in UAH (₴). Used for ranking. */
  amount: number;
}

export const donors: Donor[] = [
  { name: "LoydiN",      amount: 11006 },
  { name: "Krov",        amount: 9200 },
  { name: "DiagonBlaze", amount: 7500 },
  { name: "Alex",        amount: 4531 },
  { name: "Хоук",        amount: 3499 },
];

/** Return donors sorted by amount, biggest first. */
export function rankedDonors(): Donor[] {
  return [...donors].sort((a, b) => b.amount - a.amount);
}
