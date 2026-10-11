export function formatBalance(amount) {
  const formatAmount = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
  return formatAmount;
}
