const hoverCardbodyStyle = document.createElement("style");
hoverCardbodyStyle.id = 'hoverCardbodyStyle_id';
hoverCardbodyStyle.textContent = ".card-header:hover { background-color: #eee; cursor: pointer; } ";
(document.head || document.documentElement).appendChild(hoverCardbodyStyle);

const tableMetaSpecs = {
    ["step-data-0"]: {},

    ["step-data-1"]: {
        ["num"]: { id: 0, name: "№" },
        ["fullname"]: { id: 1, name: "прізвище, ім’я, по батькові для ідентифікації за межами україни" },
        ["document"]: { id: 2, name: "документ, що посвідчує особу" },
    },

    ["step-data-2"]: {
        ["num"]: { id: 0, name: "№" },
        ["relationship"]: { id: 1, name: "звʼязок із субʼєктом декларування" },
        ["fullname"]: { id: 2, name: "прізвище, імʼя, по батькові (за наявності) для ідентифікації в україні" },
        ["citizenship"]: { id: 3, name: "громадянство" },
        ["fullname_abroad"]: { id: 4, name: "прізвище, імʼя, по батькові для ідентифікації за межами україни, документ, що посвідчує особу" },
        ["birth_date"]: { id: 5, name: "дата народження" },
        ["tax_id"]: { id: 6, name: "реєстраційний номер облікової картки платника податків (за наявності)" },
        ["passport_details"]: { id: 7, name: "реквізити паспорта громадянина україни / свідоцтво про народження" },
        ["demographic_id"]: { id: 8, name: "унікальний номер запису в єдиному державному демографічному реєстрі (за наявності)" },
        ["location"]: { id: 9, name: "зареєстроване місце проживання" },
    },

    ["step-data-3"]: {
        ["num"]: { id: 0, name: "№" },
        ["type_characteristics"]: { id: 1, name: "вид та характеристика обʼєкта, дата набуття права" },
        ["location"]: { id: 2, name: "місцезнаходження обʼєкта" },
        ["value"]: { id: 3, name: "вартість на дату набуття права або за останньою грошовою оцінкою, грн" },
        ["info"]: { id: 4, name: "інформація щодо особи, якій належить об’єкт, і прав на нього" },
    },

    ["step-data-4"]: {},

    ["step-data-5"]: {
        ["num"]: { id: 0, name: "№" },
        ["type_characteristics"]: { id: 1, name: "вид та характеристика обʼєкта, дата набуття права" },
        ["features"]: { id: 2, name: "характеристика обʼєкта" },
        ["value"]: { id: 3, name: "вартість на дату набуття права або за останньою грошовою оцінкою, грн" },
        ["person_info"]: { id: 4, name: "інформація щодо особи, якій належить об’єкт, і прав на нього" },
    },

    ["step-data-6"]: {
        ["num"]: { id: 0, name: "№" },
        ["type_characteristics"]: { id: 1, name: "вид, загальна інформація про обʼєкт, ідентифікаційний номер (за наявності), дата набуття права" },
        ["brand_model_year"]: { id: 2, name: "марка, модель, рік випуску" },
        ["value"]: { id: 3, name: "вартість на дату набуття права або за останньою грошовою оцінкою, грн" },
        ["person_info"]: { id: 4, name: "інформація щодо особи, якій належить обʼєкт, і прав на нього" },
    },

    ["step-data-7"]: {
        ["num"]: { id: 0, name: "№" },
        ["type_characteristics"]: { id: 1, name: "вид цінного паперу, дата набуття права" },
        ["issuer"]: { id: 2, name: "емітент" },
        ["transfer_info"]: { id: 3, name: "інформація щодо передачі в управління іншій особі" },
        ["quantity"]: { id: 4, name: "кількість цінних паперів" },
        ["nominal_value"]: { id: 5, name: "номінальна вартість одного цінного папера, грн" },
        ["owner_info"]: { id: 6, name: "інформація щодо особи, якій належить обʼєкт, і прав на нього" },
    },  

    ["step-data-8"]: {},

    ["step-data-9"]: {
        ["num"]: { id: 0, name: "№" },
        ["business_info"]: { id: 1, name: "загальна інформація про субʼєкта господарювання" },
        ["address_contacts"]: { id: 2, name: "адреса та контакти субʼєкта господарювання" },
        ["object_info"]: { id: 3, name: "інформація щодо особи, якій належить обʼєкт" },
    },
    
    ["step-data-10"]: {
        ["num"]: { id: 0, name: "№" },
        ["type_characteristics"]: { id: 1, name: "вид та загальна інформація про обʼєкт, дата виникнення права" },
        ["features"]: { id: 2, name: "характеристики обʼєкта" },
        ["value"]: { id: 3, name: "вартість на дату набуття права або за останньою грошовою оцінкою, грн" },
        ["person_info"]: { id: 4, name: "інформація щодо особи, якій належить обʼєкт, і прав на нього" },
    },
    
    ["step-data-11"]: {
        ["num"]: { id: 0, name: "№" },
        ["income_source"]: { id: 1, name: "джерело (джерела) доходу" },
        ["income_type"]: { id: 2, name: "вид доходу" },
        ["amount"]: { id: 3, name: "розмір (вартість), грн" },
        ["person_info"]: { id: 4, name: "інформація про особу, яка отримала дохід" },
    },

    ["step-data-12"]: {
        ["num"]: { id: 0, name: "№" },
        ["institution_info"]: { id: 1, name: "загальна інформація про установу, в якій відкриті рахунки або до якої зроблені відповідні внески, чи про фізичну особу, якій позичено кошти" },
        ["asset_type"]: { id: 2, name: "вид активу" },
        ["asset_value"]: { id: 3, name: "розмір та валюта активу" },
        ["object_info"]: { id: 4, name: "інформація про особу, якій належить обʼєкт, і прав на нього" },
    },    

    ["step-data-17"]: { // 12.2
        ["num"]: { id: 0, name: "№" },
        ["account_type_number"]: { id: 1, name: "тип та номер рахунка, індивідуального банківського сейфу (комірки)" },
        ["owner_info"]: { id: 2, name: "інформація про фізичну або юридичну особу, яка має право розпоряджатися таким рахунком або має доступ до індивідуального банківського сейфу (комірки)" },
        ["account_holder_info"]: { id: 3, name: "інформація про фізичну або юридичну особу, яка відкрила рахунок на ім’я суб’єкта декларування або членів його сім’ї" },
        ["related_person_info"]: { id: 4, name: "інформація щодо особи, якої стосується" },
    },

    ["step-data-13"]: {
        ["num"]: { id: 0, name: "№" },
        ["liability_type"]: { id: 1, name: "вид зобовʼязання" },
        ["liability_info"]: { id: 2, name: "інформація про юридичну або фізичну особу, на користь якої виникло зобовʼязання" },
        ["liability_date"]: { id: 3, name: "дата виникнення зобовʼязання" },
        ["liability_currency"]: { id: 4, name: "валюта зобовʼязаная" },
        ["loan_amount"]: { id: 5, name: "розмір позики (кредиту), отриманої у звітному періоді, або розмір зобовʼязання за позикою (кредитом) станом на початок звітного періоду" },
        ["repayment_amount"]: { id: 6, name: "розмір сплачених у звітному періоді коштів у рахунок основної суми боргу за позикою (кредитом)" },
        ["interest_amount"]: { id: 7, name: "розмір сплачених у звітному періоді процентів за позикою (кредитом)" },
        ["liability_end_amount"]: { id: 8, name: "розмір зобовʼязання на кінець звітного періоду" },
        ["guarantor_info"]: { id: 9, name: "інформація щодо поручителів та майнового забезпечення" },
        ["liability_person_info"]: { id: 10, name: "інформація про особу, у якої виникло зобовʼязання" },
    },

    ["step-data-14"]: {
        ["num"]: { id: 0, name: "№" },
        ["transaction_type"]: { id: 1, name: "вид правочину" },
        ["transaction_date"]: { id: 2, name: "дата вчинення правочину" },
        ["subject"]: { id: 3, name: "предмет правочину" },
        ["consequences"]: { id: 4, name: "наслідки правочину" },
        ["expense_date"]: { id: 5, name: "дата здійснення разового видатку, спричиненого правочином (за наявності)" },
        ["expense_amount"]: { id: 6, name: "розмір разового видатку (за наявності), грн" },
        ["expense_country"]: { id: 7, name: "країна, у якій здійснено видаток" },
    },

    ["step-data-15"]: {},

    ["step-data-16"]: {},

    ["step-data-table_others_documents"]: {
        ["code"]: { id: 0, name: "код" },
        ["document_type"]: { id: 1, name: "тип документа" },
        ["declaration_type"]: { id: 2, name: "тип декларації" },
        ["period"]: { id: 3, name: "період" },
        ["submission_date"]: { id: 4, name: "дата та час подання" }
    }
}

const columnMapTransformations = {
    ["fullname"]: { trans: (element) => consolidateFullName(element) },
    ["fullname_abroad"]: { trans: (element) => consolidateFullName(element) },
    ["location"]: { trans: (element) => joinAddress(element) },
};

const specificStepDataTransformations = {
    ["step-data-0"]: { titleExpand: (cardTitle, cardBody, rows, stepSpec) => titleExpand0(cardTitle, cardBody, rows, stepSpec) },
    ["step-data-3"]: { trans: (table, rows, stepSpec) => summarizeObjValuesInStep3(table, rows, stepSpec) },
    ["step-data-7"]: { trans: (table, rows, stepSpec) => summarizeSecuritiesInStep7(table, rows, stepSpec) },
    ["step-data-11"]: { trans: (table, rows, stepSpec) => summarizeMoneyInStep11(table, rows, stepSpec) },
    ["step-data-12"]: { trans: (table, rows, stepSpec) => summarizeMoneyByCurrencyInStep12(table, rows, stepSpec) },
};

function cleanUnsufficientDataInCardBody(cardBody) {
    const insufficientDataPattern = /\[Не відомо\]|(\[)?Не застосовується(\])?|\[Конфіденційна інформація\]/;
    Array.from(cardBody.querySelectorAll("td")).forEach(td => {
        if (td.children.length === 0 && insufficientDataPattern.test(td.textContent.trim())) {
            td.textContent = "";
        }
    });
    Array.from(cardBody.querySelectorAll("td>div>div")).forEach(div => {
        if (insufficientDataPattern.test(div.innerText.trim())) {
            div.innerHTML = "";
        }
    });
    Array.from(cardBody.querySelectorAll("td>div")).forEach(div => {
        if (insufficientDataPattern.test(div.innerText.trim())) {
            div.innerHTML = "";
        }
    });
    // clean around the table
    Array.from(cardBody.querySelectorAll(".info-item")).forEach(item => {
        if (insufficientDataPattern.test(item.innerText.trim())) {
            removeDomElement(item);
        }    
    });
    Array.from(cardBody.querySelectorAll(".row")).forEach(row => {
        if (insufficientDataPattern.test(row.innerText.trim())) {
            removeDomElement(row);
        }    
    });
}

function lookAndProcessAllSteps() {
    Object.keys(tableMetaSpecs).forEach(key => {
        const stepSpec = tableMetaSpecs[key];

        const card = document.getElementById(key);
        if (!card) {
            console.warn(`Card with id ${key} not found`);
            return;
        }

        const cardBody = card.querySelector(".card-body");
        const pattern = /У суб'єкта декларування (чи членів його сім'ї )?відсутні об'єкти для декларування в цьому розділі\./;
        if (pattern.test(cardBody.innerText.trim())) {
            hideDomElement(card);
            return;
        }

        cleanUnsufficientDataInCardBody(cardBody);

        let rows = [];
        const table = card.querySelector("table.table");
        if (table) {
            // 1. apply transformation strategy for each column if exists
            rows = Array.from(table.rows);
            rows.slice(1).forEach(row => {
                Object.keys(stepSpec).forEach(columnKey => {
                    const columnMeta = stepSpec[columnKey];
                    const cell = row.cells[columnMeta.id];
                    if (cell) {
                        const strategy = columnMapTransformations[columnKey];
                        if (strategy) {
                            strategy.trans(cell) ;
                        }
                    }
                });
            });

            // 2. apply transformation strategy for whole table if exists
            const tableStrategy = specificStepDataTransformations[key]?.trans;
            if (tableStrategy) {
                tableStrategy(table, rows, stepSpec);
            }
        }
        
        // 3. expand title for a card
        const titleStrategy = specificStepDataTransformations[key]?.titleExpand;
        if (titleStrategy) {
            const cardTitle = card.querySelector(".card-header .card-header-title .title");
            titleStrategy(cardTitle, cardBody, rows, stepSpec);
        }
    });
}

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

function consolidateFullName(element) {
    // TODO: title assignment should be done only once, but currently it is done for each found element. Need to optimize.
    // 1. Шукаємо всі div, які мають пряму дитину (span/div) з текстом "Прізвище:"
    const xpath = "//div[./*[normalize-space()='Прізвище:']]";
    const result = findXPathElements(xpath, element);

    let isDefaultTitle = true;
    result.forEach(lastNameContainer => {
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
            removeDomElement(firstNameContainer);
            removeDomElement(middleNameContainer);

            // 5. Оновлюємо TITLE
            if (isDefaultTitle) {
                isDefaultTitle = false;
                document.title = fullName;
            }
        }
    });
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
        cellsToHide.forEach(cell => hideDomElement(cell));
    });    
}    

function titleExpand0(cardTitle, cardBody, rows, stepSpec) {
    const firstRow = cardBody.querySelector(".row");
    const description = firstRow?.children[0].children[0].innerText.trim().toLowerCase() || "?";
    const year = firstRow?.children[1].innerText.trim() || "?";
    cardTitle.innerText += ` [${description}: ${year}]`;
}

function summarizeObjValuesInStep3(table, rows, tableSpec) {
    const colValue = tableSpec.value.id;
    
    const totalValue = rows.slice(1)
    .map(row => parseFloat(row.cells[colValue].innerText.trim()) || 0)
    .reduce((sum, value) => sum + value, 0);
}        

function summarizeSecuritiesInStep7(table, rows, tableSpec) {
    const colCounts = tableSpec.quantity.id;
    const colPrice = tableSpec.nominal_value.id;

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

function summarizeMoneyInStep11(table, rows, tableSpec) {
    let total = 0.0;
    const amountsByRecipient = {};
    const colAmount = tableSpec.amount.id;
    const colRecipient = tableSpec.person_info.id;
    const dataRows = rows.slice(1);
    const uniqueRecipient = new Set(dataRows.map(row => row.cells[colRecipient].innerText.trim()));
    uniqueRecipient
        .forEach(recipient => {
            amountsByRecipient[recipient] = 0;
            dataRows
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

function summarizeMoneyByCurrencyInStep12(table, rows, tableSpec) {
    const colAmountAndCurrency = tableSpec.asset_value.id;

    const uniqueCurrencies = new Set();
    const pairsAmountAndCurrency = [];

    rows.slice(1)
        .forEach(row => {
            const amountAndCurrencyElements = row.cells[colAmountAndCurrency].querySelectorAll('.row .col-12 span:nth-child(2)');
            const amount = parseFloat(amountAndCurrencyElements[0]?.innerText.trim()) || 0;
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
    const area = 'Автономна Республіка Крим/область/місто зі спеціальним статусом';
    const district = 'Район';
    const districtInArea = 'Район в області та Автономній Республіці Крим';
    const community = 'Територіальна громада';
    const npTypeKey = 'Тип населеного пункту';

    if (data[country] && data[country] !== "Україна") parts.push(data[country]);
    if (data[region]) parts.push(`${data[region]} обл.`);
    if (data[area]) parts.push(`${data[area]}`);
    if (data[district]) parts.push(`${data[district]} р-н`);
    if (data[districtInArea]) parts.push(`${data[districtInArea]} р-н`);
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

function joinAddress(cell) {
    const rawText = cell.innerText.trim();
    if (!rawText || rawText === "Не зареєстрований") return;
    const jsonText = "{\"" + rawText.split("\n").map(e => e.replace(": ", "\": \"")).join("\", \"") + "\"}";
    const inData = JSON.parse(jsonText);
    const newValue = transformAddress(inData);
    cell.innerHTML = newValue;
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

function addBadge() {
    const badgeDiv = document.createElement("div");
    const reportYear = document.querySelector("#step-data-0 .card-body .col-lg-6:nth-child(2)").textContent.trim();
    badgeDiv.textContent = reportYear;
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
    (document.getElementById("nacp-toc") || document.body).appendChild(badgeDiv);

    document.title = `${reportYear}: ${document.title}`;
}

function processPage() {
    lookAndProcessAllSteps();
    hideEmptyTableColumns();

    addOnClickForAllCards();

    addBadge();
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