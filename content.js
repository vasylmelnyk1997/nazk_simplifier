const reportYear = document
    .querySelector("#step-data-0 .card-body .col-lg-6:nth-child(2)")
    .textContent.trim();

const docTypeText = document
    .querySelector("#step .card-body .row:nth-child(2) div:nth-child(2)")
    .textContent.trim().toLowerCase();

const tableMetaSpecs = getTableMetaSpec(docTypeText);

const declaringPerson = (() => {
    const card = document.getElementById("step-data-1");
    if (!card) {
        console.warn(`Card with id step-data-1 not found`);
        return "";
    }
    const rawData = card.querySelector(".card-body fieldset").innerText.trim();

    const fldSurname = "Прізвище:";
    const fldName = "Імʼя:";
    const fldMiddlename = "По батькові (за наявності):";

    const rawArray = rawData.split("\n");
    const extractValue = (fld) => {
        const index = rawArray.findIndex(line => line.startsWith(fld));
        return index !== -1 ? rawArray[index+1].trim() || "" : "";
    };
    const surname = extractValue(fldSurname);
    const name = extractValue(fldName);
    const middlename = extractValue(fldMiddlename);
    return toProperCase(`${surname} ${name} ${middlename}`);
})();

function cleanUnsufficientDataInCardBody(cardBody) {
    const pattern = /\[Не відомо\]|(\[)?Не застосовується(\])?|\[Конфіденційна інформація\]/;
    const isInsufficient = el => pattern.test(el.innerText.trim());
    
    cardBody.querySelectorAll("td").forEach(td => {
        if (td.children.length === 0 && isInsufficient(td)) td.textContent = "";
    });
    
    const fnCleanInnerHtml = (el) => {
        if (isInsufficient(el)) el.innerHTML = "";
    };
    cardBody.querySelectorAll("td>div>div").forEach(fnCleanInnerHtml);
    cardBody.querySelectorAll("td>div").forEach(fnCleanInnerHtml);

    const fnRemoveElementIf = el => {
        if (isInsufficient(el)) removeDomElement(el);
    };
    cardBody.querySelectorAll(".info-item").forEach(fnRemoveElementIf);
    cardBody.querySelectorAll(".row").forEach(fnRemoveElementIf);
}

function hideCardIfNoData(card, cardBody) {
    const pattern = /У суб'єкта декларування (чи членів його сім'ї )?відсутні об'єкти для декларування в цьому розділі\./;
    if (pattern.test(cardBody.innerText.trim())) {
        hideDomElement(card);
    }
}

function updateCellIds(table, stepSpecs) {
    const rows = table.rows;
    Object.keys(stepSpecs).forEach(columnKey => {
        const columnMeta = stepSpecs[columnKey];
        for (let i = 0; i < rows[0].cells.length; i++) {
            const cellName = rows[0].cells[i].innerText.trim().toLowerCase().replace(/[^а-яєїі]/g,'') ;
            const metaName = columnMeta.name.toLowerCase().replace(/[^а-яєїі]/g, '');
            if (cellName === metaName) {
                columnMeta.realId = i; // update column id in spec based on actual table structure
                break;
            }
        }
    });
}

function lookAndProcessAllSteps() {
    Object.keys(tableMetaSpecs).forEach(key => {
        const stepSpecs = tableMetaSpecs[key];

        const card = document.getElementById(key);
        if (!card) {
            console.warn(`Card with id ${key} not found`);
            return;
        }

        const cardBody = card.querySelector(".card-body");

        hideCardIfNoData(card, cardBody);
        cleanUnsufficientDataInCardBody(cardBody);

        const table = card.querySelector("table.table");
        if (table) {
            updateCellIds(table, stepSpecs);

            const rows = table.rows;
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                Object.keys(stepSpecs).forEach(columnKey => {
                    const colId = stepSpecs[columnKey].realId;
                    const cell = row.cells[colId];
                    if (cell) {
                        columnMapTransformations[columnKey]?.trans(cell);
                    }
                });
            }

            // 2. apply transformation strategy for whole table if exists
            const tableStrategy = specificStepDataTransformations[key]?.trans;
            if (tableStrategy instanceof Array) {
                for (const strategy of tableStrategy) {
                    strategy(table, stepSpecs);
                }
            } else if (tableStrategy) {
                tableStrategy(table, stepSpecs);
            }

            // 3. get description for the card if exists
            if (stepSpecs.desc_fn) {
                stepSpecs.desc_fn(table, stepSpecs);
            }
        }
        
        // 3. expand title for a card
        const titleStrategy = specificStepDataTransformations[key]?.titleExpand;
        if (titleStrategy) {
            const cardTitle = card.querySelector(".card-header .card-header-title .title");
            titleStrategy(cardTitle, cardBody);
        }
    });
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

function titleExpand0(cardTitle, cardBody) {
    const firstRow = cardBody.querySelector(".row");
    const description = firstRow?.children[0].children[0].innerText.trim().toLowerCase() || "?";
    const year = firstRow?.children[1].innerText.trim() || "?";
    cardTitle.innerText += ` [${description}: ${year}]`;
}

function summarizeObjValuesInStep3(table, tableSpec) {
    const colValue = tableSpec.value.id;
    
    const totalValue = Array.from(table.rows)
    .slice(1)
    .map(row => parseFloat(row.cells[colValue].innerText.trim()) || 0)
    .reduce((sum, value) => sum + value, 0);
}        

function summarizeSecuritiesInStep7(table, tableSpec) {
    const colCounts = tableSpec.quantity.id;
    const colPrice = tableSpec.nominal_value.id;


    const rows = Array.from(table.rows);
    const totalSecurities = rows
        .slice(1)
        .map(row => {
            const getInnerValue = (index) => row.cells[index]?.innerText.trim() || "";
            const count = parseInt(getInnerValue(colCounts)) || 0;
            const price = parseFloat(getInnerValue(colPrice)) || 0;
            return [count, price];
        })
        .reduce((sum, [count, price]) => sum + (count * price), 0);

    const newRow = rows.pop().cloneNode(true);
    for (let i = 0; i < newRow.cells.length; i++) {
        newRow.cells[i].innerText = "";
    }
    newRow.cells[colPrice].innerText = totalSecurities.toLocaleString('uk-UA', { style: 'currency', currency: 'UAH' });
    table.getElementsByTagName('tbody')[0].appendChild(newRow);
}

function summarizeMoneyInStep11(table, tableSpec) {
    let total = 0.0;
    const amountsByRecipient = {};
    const colAmount = tableSpec.amount.id;
    const colRecipient = tableSpec.person_info.id;
    const rows = Array.from(table.rows);
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

function summarizeMoneyByCurrencyInStep12(table, tableSpec) {
    const colAmountAndCurrency = tableSpec.asset_value.id;

    const uniqueCurrencies = new Set();
    const pairsAmountAndCurrency = [];

    const rows = table.rows;
    for (let i = 1; i < rows.length; i++) {
        const amountAndCurrencyElements = rows[i].cells[colAmountAndCurrency].querySelectorAll('.row .col-12 span:nth-child(2)');
        const amount = parseFloat(amountAndCurrencyElements[0]?.innerText.trim()) || 0;
        const currency = amountAndCurrencyElements[1]?.innerText.trim().slice(0, 3) || "undef";
        pairsAmountAndCurrency.push({ amount, currency });
        uniqueCurrencies.add(currency);
    }

    const newRows = [];    
    newRows[0] = rows[rows.length - 1].cloneNode(true);
    for (let i = 0; i < newRows[0].cells.length; i++) {
        newRows[0].cells[i].innerText = "";
    }

    let uahTotal = 0;
    const tbody = table.getElementsByTagName('tbody')[0];
    const currencyDiv = 
        (amount, currency) => 
                amount === 0 ? '' : `<div class="nazk-${currency}">${amount.toLocaleString('uk-UA', { style: 'currency', currency })}</div>`;
    let rowIndex = 1;
    uniqueCurrencies.forEach((currency) => {
        const total = pairsAmountAndCurrency
            .filter(pair => pair.currency === currency)
            .reduce((sum, pair) => sum + pair.amount, 0);
        newRows[rowIndex] = newRows[0].cloneNode(true);
        let uahAmount = 0;
        let nonUahAmount = 0;
        if (currency === "UAH") {
            uahAmount = +total;
        } else {
            nonUahAmount = +total;
            uahAmount = +convertCurrency(total, currency, "UAH", reportYear);
        }
        uahTotal += +uahAmount;
        newRows[rowIndex].cells[colAmountAndCurrency].innerHTML =
            currencyDiv(nonUahAmount, currency) + currencyDiv(uahAmount, "UAH");
        tbody.appendChild(newRows[rowIndex]);
        rowIndex++;
    });
    newRows[0].cells[colAmountAndCurrency].innerHTML = currencyDiv(uahTotal, "UAH");
    tbody.appendChild(newRows[0]);
}

function transformAddress(data) {
    const placeOfLiving = 'Населений пункт';

    const country = 'Країна';
    const region = 'Область';
    const area = 'Автономна Республіка Крим/область/місто зі спеціальним статусом';
    const district = 'Район';
    const districtInArea = 'Район в області та Автономній Республіці Крим';
    const community = 'Територіальна громада';
    const npTypeKey = 'Тип населеного пункту';

    const transformAddressLegacy = (data) => {
        if (!data) return [];
        const livingPlaceParts = data.split('/').toReversed() || [];
        const skipCountry = livingPlaceParts[0].trim() === "Україна"? 1: 0;
        return livingPlaceParts.slice(skipCountry).map(part => part.trim());
    }

    const transformAddressNew = (data) => {
        const parts = [];

        if (data[country] && data[country] !== "Україна") parts.push(data[country]);
        if (data[area]) parts.push(`${data[area]} обл.`);
        if (data[region]) parts.push(`${data[region]} обл.`);
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

        if (data[placeOfLiving]) {
            parts.push(`${npType} ${data[placeOfLiving]}`.trim());
        }    

        return parts;
    }

    const legacy = Object.keys(data).length === 2
                && data[country]
                && data[placeOfLiving];

    const parts = legacy  
            ? transformAddressLegacy(data[placeOfLiving])
            : transformAddressNew(data);

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
    badgeDiv.className = "nazk-year-badge";
    
    const navItemDiv = document.createElement("div");
    navItemDiv.className = "nazk-nav-item";
    
    const yearDiv = document.createElement("div");
    yearDiv.textContent = reportYear;
    
    const ddlDiv = document.createElement("div");
    ddlDiv.className = "nazk-dropdown";
    ddlDiv.innerHTML = tableMetaSpecs["step-data-table_others_documents"].desc_fn_result || "Документи";

    navItemDiv.appendChild(yearDiv);
    navItemDiv.appendChild(ddlDiv);
    badgeDiv.appendChild(navItemDiv);

    (document.getElementById("nacp-toc") || document.body).appendChild(badgeDiv);

    document.title = `${reportYear}: ${declaringPerson}`;
}

function parseRealEstateTable(table, stepSpec) {
    objType = "Вид об'єкта";
    objType2 = "Інший вид об'єкта";
    objDate = "Дата набуття права";
    objAreaHectar = "Загальна площа (га)";
    objAreaM2 = "Загальна площа (м2)";
    objAddress = "Адреса";
    objOwnership = "Власність";

    const results = [];

    const normalizePercent = (value) => {
        if (value === null || value === undefined) return NaN;
        return parseFloat(String(value).replace(',', '.').replace(/\s+/g, ''));
    };

    const formatShareText = (rawPercent) => {
        const percent = normalizePercent(rawPercent);
        if (!Number.isFinite(percent) || percent <= 0) {
            return "";
        }
        const fixedPercent = Number(percent.toFixed(2)).toString();
        return `, частка ${fixedPercent}%`;
    };

    const tabMeta = tableMetaSpecs["step-data-3"];
    const rows = table.rows;
    for (let index = 1; index < rows.length; index++) {
        const row = rows[index];
        const cells = row.querySelectorAll('td');
        if (cells.length < 5) continue; // Пропускаємо некоректні рядки

        const locationData = cells[tabMeta.type_characteristics.realId].innerText.trim();
        const text = cells[tabMeta.location.realId].innerText.trim() + (locationData === "" ? "" : `\n${locationData}`);

        const data = toJSON(text);

        // 4. Розрахунок частки та прав з п'ятої комірки права власності
        const cellRights = cells[tabMeta.info.realId];

        const rightsRows = Array.from(cellRights.getElementsByClassName("row"));
        const rightsNotes = [];

        const firstRightsRowParts = rightsRows[0]?.innerText.split('\n');
        const ownTypeParts = firstRightsRowParts?.[0]?.trim().toLowerCase().split(',');
        const checkOwnTypeTxt = ownTypeParts[0];
        let checkPerson = "";
        for (let i = 1; i < firstRightsRowParts.length; i++) {
            const iParts = firstRightsRowParts[i].split(':');
            if (iParts.length > 1 && iParts[0].trim() === "ПІБ") {
                checkPerson = iParts[1].trim();
                break;
            }
        }
        switch (checkOwnTypeTxt) {
            case "власність":
                if  (checkPerson === declaringPerson) {
                    rightsNotes.push(", частка 1/1");
                } else {
                    rightsNotes.push(", власність: " + checkPerson);
                }
                break;
            case "спільна часткова власність":
            case "Спільна сумісна власність":
                if (!firstRightsRowParts.some(part => {
                    const shareMatch = part.match(/Частка власності,\s*%:\s*([0-9,\.]+)/i);
                    if (shareMatch) {
                        rightsNotes.push(formatShareText(shareMatch[1]));
                        return true;
                    }
                })) {
                    rightsNotes.push(", " + checkOwnTypeTxt);
                };
                break;
            case "інше право користування":
            case "право власності третьої особи":
            default:
                rightsNotes.push(", " + checkOwnTypeTxt);
        }

        const objOwnRights = rightsNotes.length > 0 ? rightsNotes.join('') : "";

        const areaSquare = data[objAreaM2]
            ? `${data[objAreaM2]} м²`
            : (data[objAreaHectar]
                ? `${data[objAreaHectar]} га`
                : "площа не вказана");

        const objTypeValue = data[objType]?.toLowerCase() === "інше"
            ? data[objType2]
            : data[objType]
            || "невідомий тип об'єкта";

        const specifiedCost = +row.cells[3].innerText.split("\n")[0] || 0;
        const objPrice = specifiedCost > 0 ? `, вартість: ${specifiedCost} грн` : "";

        // Форматуємо підсумковий рядок для поточного об'єкта
        const record = `${index}) ${objTypeValue.toLowerCase()}, загальна площа: ${areaSquare}, за адресою: ${data[objAddress]}, у власності з ${data[objDate]}${objOwnRights}${objPrice};`;
        results.push(record);
    }

    return results;
}

function simplifyTextToEDRPOU(table, stepSpec) {
    findAndReplaceText(
        "Код в Єдиному державному реєстрі юридичних осіб, фізичних осіб – підприємців та громадських формувань:",
        "Код ЄДРПОУ:",
    {root: table});
}

const columnMapTransformations = {
    // (element) => transform_fn(element)
    ["fullname"]: { trans: consolidateFullName },
    ["fullname_abroad"]: { trans: consolidateFullName },
    ["location"]: { trans: joinAddress },
};

const specificStepDataTransformations = {
    // (cardTitle, cardBody) => titleExpand_fn(cardTitle, cardBody)
    ["step-data-0"]: { titleExpand: titleExpand0 },
    // (table, stepSpec) => transform_fn(table, stepSpec)
    ["step-data-3"]: { trans: summarizeObjValuesInStep3 },
    ["step-data-7"]: { trans: summarizeSecuritiesInStep7 },
    ["step-data-8"]: { trans: simplifyTextToEDRPOU },
    ["step-data-9"]: { trans: simplifyTextToEDRPOU },
    ["step-data-10"]: { trans: simplifyTextToEDRPOU },
    ["step-data-11"]: { trans: [summarizeMoneyInStep11, simplifyTextToEDRPOU] },
    ["step-data-12"]: { trans: [summarizeMoneyByCurrencyInStep12, simplifyTextToEDRPOU] },
    /* step-data-17 -> 12.1 */
    ["step-data-17"]: { trans: simplifyTextToEDRPOU },
    ["step-data-13"]: { trans: simplifyTextToEDRPOU },
};

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