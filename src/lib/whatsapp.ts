/** wa.me link for a number like "+92 300 1234567", with an optional prefilled message. */
export function whatsappLink(number: string, message?: string): string {
  const digits = number.replace(/\D/g, "");
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${query}`;
}
