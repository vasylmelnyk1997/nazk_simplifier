const hoverCardbodyStyle = document.createElement("style");
hoverCardbodyStyle.id = 'hoverCardbodyStyle_id';
hoverCardbodyStyle.textContent = ".card-header:hover { background-color: #eee; cursor: pointer; } ";
(document.head || document.documentElement).appendChild(hoverCardbodyStyle);

function hideOrRemoveDomElement(element) {
    if (element) {
        element.remove();
    }
}

function hideTargetElements(targetText) {
    // Використовуємо ваш уточнений XPath: батьківський div, 
    // у якого прямий нащадок (div або span) має потрібний текст
    // або має клас color-1 і містить цей текст
    const xpaths = [  `//div[./span[contains(text(),'${targetText}')] or ./div[contains(text(),'${targetText}')]]`
                    , `//div[./span[@class='color-1'] and contains(text(), '${targetText}')]`
                    , `//div[@class="card" and ./div[@class="card-body" and normalize-space()="У суб'єкта декларування чи членів його сім'ї відсутні об'єкти для декларування в цьому розділі."]]`
                    , `//div[@class="card" and ./div[@class="card-body" and normalize-space()="У суб'єкта декларування відсутні об'єкти для декларування в цьому розділі."]]`
                   ];

    xpaths.forEach(xpath => {
        const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        for (let i = 0; i < result.snapshotLength; i++) {
            const node = result.snapshotItem(i);
            hideOrRemoveDomElement(node);
        }
    });
}

function replaceTargetText(targetText) {
    const xpath = `//*[contains(text(), '${targetText}')]`;

    const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    for (let i = 0; i < result.snapshotLength; i++) {
        result.snapshotItem(i).innerText = "";
    }
}

function toProperCase(text) {
    return text.toLowerCase().replace(/(^|\s)\S/g, (match) => match.toUpperCase());
}

function consolidateFullName() {
    // 1. Шукаємо всі div, які мають пряму дитину (span/div) з текстом "Прізвище:"
    const xpath = "//div[./*[normalize-space()='Прізвище:']]";
    const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    for (let i = 0; i < result.snapshotLength; i++) {
        const lastNameContainer = result.snapshotItem(i);

        // Отримуємо значення прізвища (зазвичай це другий елемент всередині div)
        const lastName = lastNameContainer.innerText.split(':')[1]?.trim() || "**Невідомо**";

        // 2. Знаходимо наступні сусідні елементи (Ім'я та По-батькові)
        const firstNameContainer = lastNameContainer.nextElementSibling;
        const middleNameContainer = firstNameContainer?.nextElementSibling;

        if (firstNameContainer && middleNameContainer) {
            const firstName = firstNameContainer.innerText.split(':')[1]?.trim() || "";
            const middleName = middleNameContainer.innerText.split(':')[1]?.trim() || "";

            // 3. Оновлюємо перший контейнер: міняємо "Прізвище:" на "ПІБ:" 
            // та об'єднуємо всі три значення
            const fullName = toProperCase(`${lastName} ${firstName} ${middleName}`);
            lastNameContainer.innerHTML = `
              <div style="background-color: #f2f8fd">
                <span class="color-1">ПІБ: </span>
                <span>${fullName}</span>
              </div>
            `; // Очищаємо вміст, щоб додати новий

            // 4. Приховуємо або видаляємо контейнери Імені та По-батькові
            hideOrRemoveDomElement(firstNameContainer);
            hideOrRemoveDomElement(middleNameContainer);
        }
    }
}

function replaceText(targetText, replacementText) {
    const xpath = `//span[contains(text(), '${targetText}')]`;
    const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    for (let i = 0; i < result.snapshotLength; i++) {
        result.snapshotItem(i).innerText = replacementText;
    }
}

function hideEmplyStepData() {
    const xpath = `//div[@class="card" and contains(., "У суб'єкта декларування чи членів його сім'ї відсутні об'єкти для декларування в цьому розділі")]`;
    const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    for (let i = 0; i < result.snapshotLength; i++) {
        const node = result.snapshotItem(i);
        hideOrRemoveDomElement(node);
    }
}

function hideEmptyTableColumns() {
    const tables = document.querySelectorAll('table.table');

    tables.forEach(table => {
        const columnCount = table.querySelectorAll('tr:first-of-type td').length;
        let cellsToHide = [];

        for (let colIndex = 1; colIndex <= columnCount; colIndex++) {
            const colHeadCells = Array.from(table.querySelectorAll(`tr th:nth-child(${colIndex})`));
            const colBodyCells = Array.from(table.querySelectorAll(`tr td:nth-child(${colIndex})`));
            const isEmpty = colBodyCells.every(cell => cell.innerText.trim() === "");
            if (isEmpty) {
                cellsToHide.push(...colBodyCells, ...colHeadCells);
            }
        }

        // Приховуємо порожні стовпці
        cellsToHide.forEach(cell => hideOrRemoveDomElement(cell));
    });
}

function findColumnByName(table, name) {
    return +(Array.from(table.getElementsByTagName("th"))
        .findIndex(th => th.textContent.toLowerCase() === name.toLowerCase()));
}

function tableStepNum(number, columnNames) {
    const table = document.querySelector(`#step-data-${number} table.table`);
    if (!table) {
        return undefined;
    }
    return {
        table,
        columns: Object.fromEntries(
            columnNames.map(name => [name, findColumnByName(table, name)])
        )
    };
}

const columnsInTableStep11 = {
    ["amount"]: "Розмір (вартість), грн",
    ["incomeRecipient"]: "Інформація про особу, яка отримала дохід"
};

function distinctMoneyRecipientsInStep11(tableSpec) {
    const table = tableSpec.table;
    const rows = table.rows;
    const recipients = new Set();

    const colRecipient = tableSpec.columns[columnsInTableStep11.incomeRecipient];
    for (let i = 1; i < rows.length; i++) {
        const recipientCell = rows[i].cells[colRecipient];
        const recipient = recipientCell.innerText.trim();
        if (recipient) {
            recipients.add(recipient);
        }
    }
    return recipients;
}

function summarizeMoneyInStep11(tableSpec) {
    const table = tableSpec.table;
    const rows = Array.from(table.rows);

    const colAmount = tableSpec.columns[columnsInTableStep11.amount];
    const colRecipient = tableSpec.columns[columnsInTableStep11.incomeRecipient];
    let total = 0.0;
    const amountsByRecipient = {};
    distinctMoneyRecipientsInStep11(tableSpec)
        .forEach(recipient => {
            amountsByRecipient[recipient] = 0;
            rows.slice(1)
                .filter(row => row.cells[colRecipient].innerText.trim() === recipient)
                .forEach(row => {
                    const amountCell = row.cells[colAmount];
                    const amount = parseFloat(amountCell.innerText) || 0;
                    amountsByRecipient[recipient] += amount;
                });
        });

    const newRow = rows[rows.length - 1].cloneNode(true);
    for (let i = 0; i < newRow.cells.length; i++) {
        newRow.cells[i].innerText = "";
    }

    Object.keys(amountsByRecipient).forEach((recipient) => {
        total += amountsByRecipient[recipient];

        const recipientRow = newRow.cloneNode(true);

        recipientRow.cells[colRecipient].innerText = recipient;
        recipientRow.cells[colAmount].innerText = amountsByRecipient[recipient].toLocaleString('uk-UA', { style: 'currency', currency: 'UAH' });

        table.getElementsByTagName('tbody')[0].appendChild(recipientRow);
    });

    const totalCell = newRow.cells[colAmount];
    totalCell.innerText = total.toLocaleString('uk-UA', { style: 'currency', currency: 'UAH' });

    table.getElementsByTagName('tbody')[0].appendChild(newRow);
}

const columnsInTableStep12 = {
    ["amountAndCurrency"]: "Розмір та валюта активу",
};

function summarizeMoneyByCurrencyInStep12(tableSpec) {
    const table = tableSpec.table;
    const rows = Array.from(table.rows);

    const colAmountAndCurrency = tableSpec.columns[columnsInTableStep12.amountAndCurrency];

    const uniqueCurrencies = new Set();
    const pairsAmountAndCurrency = [];

    rows.slice(1)
        .forEach(row => {
            const amountAndCurrencyElements = row.cells[colAmountAndCurrency].querySelectorAll('.row .col-12 span:nth-child(2)');
            const amount = parseFloat(amountAndCurrencyElements[0].innerText.trim()) || 0;
            const currency = amountAndCurrencyElements[1]?.innerText.trim().slice(0, 3) || "undef";
            pairsAmountAndCurrency.push({ amount, currency });
            uniqueCurrencies.add(currency);
        });

    const newRows = [];
    newRows[0] = rows[rows.length - 1].cloneNode(true);
    for (let i = 0; i < newRows[0].cells.length; i++) {
        newRows[0].cells[i].innerText = "";
    }

    const tbody = table.getElementsByTagName('tbody')[0];
    uniqueCurrencies.forEach((currency, i) => {
        const total = pairsAmountAndCurrency
            .filter(pair => pair.currency === currency)
            .reduce((sum, pair) => sum + pair.amount, 0);
        if (i !== 0) {
            newRows[i] = newRows[0].cloneNode(true);
        }
        newRows[i].cells[colAmountAndCurrency].innerText = `${total} ${currency}`;
        tbody.appendChild(newRows[i]);
    });
}

function transformAddress(data) {
    // 2. Формуємо скорочення та логіку відображення
    const parts = [];
    
    const country = 'Країна';
    const region = 'Область';
    const district = 'Район';
    const community = 'Територіальна громада';
    const npTypeKey = 'Тип населеного пункту';

    if (data[country] && data[country] !== "Україна") parts.push(data[country]);
    if (data[region]) parts.push(`${data[region]} обл.`);
    if (data[district]) parts.push(`${data[district]} р-н`);
    if (data[community]) parts.push(`${data[community]} ТГ`);

    // Визначаємо скорочення для типу населеного пункту
    let npType = '';
    if (data[npTypeKey]) {
        const type = data[npTypeKey].toLowerCase();
        if (type === 'село') npType = 'с.';
        else if (type === 'місто') npType = 'м.';
        else if (type.startsWith('селище')) npType = 'с-ще';
    }

    const placeOfLiving = 'Населений пункт';
    if (data[placeOfLiving]) {
        parts.push(`${npType} ${data[placeOfLiving]}`.trim());
    }

    // 3. Створюємо новий HTML вміст
    return `
        <div class="info-item">
            <span class="info-title">Адреса: </span>
            <span class="info-value">${parts.join(', ')}</span>
        </div>
    `;
}

function joinAddressPartsInTable(stepNumber, addressColumnIndex) {
    const tableSpec = tableStepNum(stepNumber, []);
    if (!tableSpec) return;
    tableSpec.table
        .querySelectorAll(`tr td:nth-child(${addressColumnIndex})`)
        .forEach(cell => {
            const rawText = cell.innerText.trim();
            if (!rawText) return;
            const jsonText = "{\"" + rawText.split("\n").map(e=>e.replace(": ", "\": \"")).join("\", \"") + "\"}";
            const inData = JSON.parse(jsonText);
            const newValue = transformAddress(inData);
            cell.innerHTML = newValue;
        });
}

const columnsInTableStep7 = {
    ["counts"]: "Кількість цінних паперів",
    ["price"]: "Номінальна вартість одного цінного папера, грн",
};

function summarizeSecuritiesInStep7(tableSpec) {
    const table = tableSpec.table;

    const colCounts = tableSpec.columns[columnsInTableStep7.counts];
    const colPrice = tableSpec.columns[columnsInTableStep7.price];

    const rows = Array.from(table.rows);
    const totalSecurities = rows.slice(1)
        .map(row => {
            const getInnerValue = (index) => row.cells[index]?.innerText.trim() || "";
            const count = parseInt(getInnerValue(colCounts)) || 0;
            const price = parseFloat(getInnerValue(colPrice)) || 0;
            return [count, price];
        })
        .reduce((sum, [count, price]) => sum + (count * price), 0);

    const newRow = rows[rows.length - 1].cloneNode(true);
    for (let i = 0; i < newRow.cells.length; i++) {
        newRow.cells[i].innerText = "";
    }
    newRow.cells[colPrice].innerText = totalSecurities.toLocaleString('uk-UA', { style: 'currency', currency: 'UAH' });
    table.getElementsByTagName('tbody')[0].appendChild(newRow);
}

function addOnClickForAllCards() {
    const fnToggle = (cardHeader) => {
        const cardBody = cardHeader.nextElementSibling;
        if (cardBody) {
            cardBody.style.display = cardBody.style.display === "" ? "none" : "";
        }
    };
    document
        .querySelectorAll(".card-header")
        .forEach((cardHeader) => {
            fnToggle(cardHeader);
            cardHeader.addEventListener(
                'click',
                (event) => {
                    fnToggle(event.currentTarget);
                    return true;
                })
        })
        
}

function addBadge(text, elementToAppend) {
    const badgeDiv = document.createElement("div");
    badgeDiv.textContent = text;
    Object.assign(badgeDiv.style, {
        position: 'fixed',
        zIndex: '300',
        top: '0',
        left: '50px',
        padding: '0 12px',
        border: '1px solid #bbb',
        borderTopRightRadius: '0',
        borderTopLeftRadius: '0',
        borderBottomRightRadius: '4px',
        borderBottomLeftRadius: '4px',
        fontSize: '16px',
        fontWeight: 'bold',
        backgroundColor: 'coral',
        color: 'whitesmoke',
    });
    elementToAppend.appendChild(badgeDiv);
}

function processPage() {
    // тексти для приховування та заміни
    const targetTexts = [
        "Конфіденційна інформація",
        "Не застосовується"
    ];

    targetTexts.forEach(targetText => {
        hideTargetElements(targetText);
        replaceTargetText(targetText);
    });

    const replacementPairs = [
        ["Прізвище (відповідно до документа, що посвідчує особу)", "Прізвище:"],
        ["Ім’я (відповідно до документа, що посвідчує особу)", "Ім’я:"],
        ["Тип документа, що посвідчує особу", "Тип документа:"],
        ["Автономна Республіка Крим/область/місто зі спеціальним статусом", "Область:"],
        ["Район в області та Автономній Республіці Крим", "Район:"],
        ["Код в Єдиному державному реєстрі юридичних осіб, фізичних осіб", "Код ЄДРПОУ:"],
        ["Країна, в якій видано документ", "Країна:"],
    ];
    replacementPairs.forEach(([targetText, replacementText]) => {
        replaceText(targetText, replacementText);
    });

    consolidateFullName();

    hideEmplyStepData();
    hideEmptyTableColumns();

    const tab7 = tableStepNum(7, Object.keys(columnsInTableStep7).map(alias => columnsInTableStep7[alias]));
    if(tab7) {
        summarizeSecuritiesInStep7(tab7);
    }
    
    const tab11 = tableStepNum(11, Object.keys(columnsInTableStep11).map(alias => columnsInTableStep11[alias]));
    if(tab11) {
        summarizeMoneyInStep11(tab11);
    }
    
    const tab12 = tableStepNum(12, Object.keys(columnsInTableStep12).map(alias => columnsInTableStep12[alias]));
    if(tab12) {
        summarizeMoneyByCurrencyInStep12(tab12);
    }

    joinAddressPartsInTable(2, 10);
    joinAddressPartsInTable(3, 3);
    joinAddressPartsInTable(4, 3);

    const reportYear = document.querySelector("#step-data-0 .card-body .col-lg-6:nth-child(2)").textContent.trim();
    addBadge(
        reportYear,
        document.getElementById("nacp-toc") || document.body
    );
    document.title = `${reportYear}: ${document.title}`;

    addOnClickForAllCards();
}

// Запускаємо при завантаженні
processPage();

// Стежимо за змінами на сторінці (для динамічного контенту)
// const observer = new MutationObserver(() => {
//     processPage();
// });

// observer.observe(document.body, {
//     childList: true,
//     subtree: true
// });