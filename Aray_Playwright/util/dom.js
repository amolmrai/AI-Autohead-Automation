// utils/dom.js
async function getDomSnapshot(page) {
  return await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('input, button, select, textarea, label, a'));
    return elements.map(el => ({
      tag: el.tagName.toLowerCase(),
      id: el.id,
      name: el.name,
      placeholder: el.placeholder,
      text: el.innerText,
      type: el.type,
      class: el.className,
      outerHTML: el.outerHTML.slice(0, 200),
    }));
  });
}
module.exports = { getDomSnapshot };
