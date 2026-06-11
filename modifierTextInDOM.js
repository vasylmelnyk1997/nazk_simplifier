/**
 * Знаходить і замінює текст у DOM-елементах на сторінці.
 *
 * @param {string} searchText  - текст для пошуку
 * @param {string} replaceText - текст для заміни
 * @param {Object} [options]
 * @param {boolean} [options.caseSensitive=false] - враховувати регістр
 * @param {boolean} [options.wholeWord=false]     - тільки цілі слова
 * @param {Node}    [options.root=document.body]  - кореневий елемент для пошуку
 * @returns {{ count: number, nodes: Text[] }}    - кількість замін і змінені вузли
 */
function findAndReplaceText(searchText, replaceText, options = {}) {
    const {
        caseSensitive = false,
        wholeWord = false,
        root = document.body,
    } = options;

    if (!searchText) return { count: 0, nodes: [] };

    const flags = caseSensitive ? 'g' : 'gi';
    const escaped = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = wholeWord ? `\\b${escaped}\\b` : escaped;
    const regex = new RegExp(pattern, flags);

    // Обходимо тільки текстові вузли, пропускаючи script/style
    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode(node) {
                const tag = node.parentElement?.tagName?.toUpperCase();
                if (tag === 'SCRIPT' || tag === 'STYLE') {
                    return NodeFilter.FILTER_REJECT;
                }
                return regex.test(node.nodeValue)
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_SKIP;
            },
        }
    );

    const affectedNodes = [];
    let totalCount = 0;

    while (walker.nextNode()) {
        const node = walker.currentNode;
        node.nodeValue = node.nodeValue.replace(regex, replaceText);
        totalCount++;
        affectedNodes.push(node);
    }

    return { count: totalCount, nodes: affectedNodes };
}