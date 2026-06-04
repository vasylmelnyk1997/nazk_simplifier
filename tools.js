function removeDomElement(element) {
    if (element) {
        element.remove();
    }
}

function hideDomElement(element) {
    if (element) {
        element.style.display = "none";
    }
}

function findXPathElements(xpath, context = document) {
    const result = document.evaluate(xpath, context, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const elements = [];
    for (let i = 0; i < result.snapshotLength; i++) {
        elements.push(result.snapshotItem(i));
    }
    return elements;
}

function toProperCase(text) {
    return text.toLowerCase().replace(/(^|\s)\S/g, (match) => match.toUpperCase());
}
