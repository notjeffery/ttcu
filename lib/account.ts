// Single source of truth for the customer's account data. Both the
// dashboard and wallet pages import the balance from here, so they
// can never show different numbers. Replace this with a real
// Supabase query later.

export const mockAccount = {
  balance: 12480.5,
  cardLast4: "2569",
  expDate: "10/28",
};
