const DOCTYPE = Object.freeze({
    DECLARATION: 'DECLARATION',
    CHANGES: 'CHANGES',
});

const MAP_TO_DOCTYPE = {
    ["декларація"]: DOCTYPE.DECLARATION,
    ["повідомлення про суттєві зміни в майновому стані"]: DOCTYPE.CHANGES
};

const tableMetaSpecsDef = {
    [DOCTYPE.DECLARATION]: {
        ["docType"]: "декларація",

        ["step-data-0"]: {},

        ["step-data-1"]: {
            ["num"]: { id: 0, name: "№" },
            ["fullname"]: { id: 1, name: "прізвище, ім'я, по батькові для ідентифікації за межами україни" },
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
/*
step-data-3 -- інша версія таблиці
№
загальна інформація
місцезнаходження
вартість на дату набуття
вартість за останньою оцінкою
інформація щодо прав на об'єкт
*/
        ["step-data-3"]: {
            ["num"]: { id: 0, name: "№" },
            ["type_characteristics"]: { id: 1, name: "вид та характеристика обʼєкта, дата набуття права" },
            ["location"]: { id: 2, name: "місцезнаходження обʼєкта" },
            ["value"]: { id: 3, name: "вартість на дату набуття права або за останньою грошовою оцінкою, грн" },
            ["info"]: { id: 4, name: "інформація щодо особи, якій належить об'єкт, і прав на нього" },
            ["desc_fn"]: (table, stepSpec) => {
                // tech debt
                // test case: Явтушенко Олександр Миколайович, 2017
                try {
                    const arrResult = parseRealEstateTable(table, stepSpec);
                    insertCollectedResultTable(arrResult, table);
                } catch (error) {
                    console.error("Error occurred while processing real estate table:", error);
                }
            },
        },

        ["step-data-4"]: {},

        ["step-data-5"]: {
            ["num"]: { id: 0, name: "№" },
            ["type_characteristics"]: { id: 1, name: "вид та характеристика обʼєкта, дата набуття права" },
            ["features"]: { id: 2, name: "характеристика обʼєкта" },
            ["value"]: { id: 3, name: "вартість на дату набуття права або за останньою грошовою оцінкою, грн" },
            ["person_info"]: { id: 4, name: "інформація щодо особи, якій належить об'єкт, і прав на нього" },
        },

        ["step-data-6"]: {
            ["num"]: { id: 0, name: "№" },
            ["type_characteristics"]: { id: 1, name: "вид, загальна інформація про обʼєкт, ідентифікаційний номер (за наявності), дата набуття права" },
            ["brand_model_year"]: { id: 2, name: "марка, модель, рік випуску" },
            ["value"]: { id: 3, name: "вартість на дату набуття права або за останньою грошовою оцінкою, грн" },
            ["person_info"]: { id: 4, name: "інформація щодо особи, якій належить обʼєкт, і прав на нього" },
            ["desc_fn"]: (table, stepSpec) => {
                try {
                    if (table && table.rows.length === 1) {
                        return;
                    }
                    const typeVehicle = "Вид майна";
                    const ownershipDate = "Дата набуття права";
                    const brand = "Марка";
                    const model = "Модель";
                    const year = "Рік випуску"; 

                    const vehicleData = [];
                    for (let i = 1; i < table.rows.length; i++) {
                        const cells = table.rows[i].cells;

                        const data = toJSON(
                            cells[stepSpec.type_characteristics.id].innerText.trim()
                            + "\n" 
                            + cells[stepSpec.brand_model_year.id].innerText.trim()
                        );

                        const ownershipInfo = cells[stepSpec.person_info.id].innerText
                            .split("\n")
                            .reduce((acc, s) => {
                                if (acc !== "") acc += " ";
                                
                                if (s.startsWith("ПІБ:")) {
                                    acc += s.substring(4).trim();
                                } else {
                                    acc += s.trim().toLowerCase();
                                }
                                return acc;
                            }, "");

                        vehicleData.push(`${i}) ${data[typeVehicle].toLowerCase()} ${data[brand]} ${data[model]}, ${data[year]} р.в., у власності з ${data[ownershipDate]}, ${ownershipInfo}`);
                    }

                    insertCollectedResultTable(vehicleData, table);
                } catch (error) {
                    console.error("Error occurred while processing real estate table:", error);
                }
            },
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
            ["account_holder_info"]: { id: 3, name: "інформація про фізичну або юридичну особу, яка відкрила рахунок на ім'я суб'єкта декларування або членів його сім'ї" },
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
            ["submission_date"]: { id: 4, name: "дата та час подання" },
            ["desc_fn"]: (table, stepSpec) => {
                try {
                    const rows = table.rows;
                    stepSpec["desc_fn_result"] = "";
                    for (let i = 1; i < rows.length; i++) {
                        const cells = rows[i].cells;
                        const id = cells[0].textContent.trim();
                        const docType = cells[1].textContent.trim();
                        const declType = cells[2].textContent.trim();
                        const period = cells[3].textContent.trim();
                        stepSpec["desc_fn_result"] += `<div><a href="https://public.nazk.gov.ua/documents/${id}" target="_blank">${period} ${docType} ${declType}</a></div>`;
                    }
                } catch (error) {
                    console.error("Error occurred while processing real estate table:", error);
                }
            },
        }
    },
    [DOCTYPE.CHANGES]: {
        ["docType"]: "повідомлення про суттєві зміни в майновому стані",

        ["step-data-3"]: {
            ["num"]: { id: 0, name: "№" },
            ["type_characteristics"]: { id: 1, name: "вид та характеристика об’єкта, дата набуття права" },
            ["location"]: { id: 2, name: "місцезнаходження об’єкта" },
            ["value"]: { id: 3, name: "вартість на дату набуття права власності, грн" },
            ["info"]: { id: 4, name: "інформація щодо прав на об’єкт" },
            ["source"]: { id: 5, name: "інформація про джерело (джерела)" },
        },
    }
};

function insertCollectedResultTable(data, table) {
    const resultContainer = document.createElement('div');
    resultContainer.classList.add('nazk-collection-results');
    resultContainer.classList.add('nazk-box-blinking');
    resultContainer.title = "Натисніть, щоб скопіювати";

    data.forEach((result) => {
        const resultDiv = document.createElement('div');
        resultDiv.classList.add('nazk-collection-item');
        resultDiv.textContent = result;
        resultContainer.appendChild(resultDiv);
    });

    table.parentNode.insertBefore(resultContainer, table);

    resultContainer.addEventListener('click', _ => {
        navigator.clipboard.writeText(resultContainer.innerText);
        resultContainer.classList.add('animate-blink');
        resultContainer.addEventListener('animationend', () => {
            resultContainer.classList.remove('animate-blink');
        }, { once: true });
    });
}

function getTableMetaSpec(docTypeText) {
    const docType = MAP_TO_DOCTYPE[docTypeText];
    return tableMetaSpecsDef[docType];
}
