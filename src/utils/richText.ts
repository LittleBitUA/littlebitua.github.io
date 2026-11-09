// Простий текст із посиланнями у форматі [текст](https://…) → безпечний HTML.
// Решта тексту екранується; переноси рядків зберігає CSS (white-space: pre-line).
const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function richText(text: string): string {
  return escape(text).replace(
    /\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g,
    (_, label, url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`,
  );
}
