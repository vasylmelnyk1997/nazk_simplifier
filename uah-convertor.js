const RATES_ARCHIVE = {
  2014: {
    // 31.12.2014 (середа — робочий день)
    USD: { nbu: 15.7686, commercial: { buy: 15.60,  sell: 16.00  } },
    EUR: { nbu: 19.2326, commercial: { buy: 19.00,  sell: 19.60  } },
  },
  2015: {
    // 31.12.2015 (четвер — робочий день)
    USD: { nbu: 24.0007, commercial: { buy: 23.80,  sell: 24.30  } },
    EUR: { nbu: 26.2230, commercial: { buy: 26.00,  sell: 26.70  } },
  },
  2016: {
    // 30.12.2016 (п'ятниця — останній робочий день, 31.12 — субота)
    USD: { nbu: 27.1909, commercial: { buy: 27.00,  sell: 27.50  } },
    EUR: { nbu: 28.4228, commercial: { buy: 28.10,  sell: 28.90  } },
  },
  2017: {
    // 29.12.2017 (п'ятниця — останній робочий день)
    USD: { nbu: 28.0672, commercial: { buy: 27.85,  sell: 28.35  } },
    EUR: { nbu: 33.4954, commercial: { buy: 33.20,  sell: 34.00  } },
  },
  2018: {
    // 31.12.2018 (понеділок — робочий день)
    USD: { nbu: 27.6882, commercial: { buy: 27.50,  sell: 28.00  } },
    EUR: { nbu: 31.7141, commercial: { buy: 31.40,  sell: 32.10  } },
  },
  2019: {
    // 31.12.2019 (вівторок — робочий день)
    USD: { nbu: 23.6863, commercial: { buy: 23.50,  sell: 23.95  } },
    EUR: { nbu: 26.4246, commercial: { buy: 26.10,  sell: 26.80  } },
  },
  2020: {
    // 31.12.2020 (четвер — робочий день)
    USD: { nbu: 28.2745, commercial: { buy: 28.05,  sell: 28.55  } },
    EUR: { nbu: 34.7075, commercial: { buy: 34.30,  sell: 35.10  } },
  },
  2021: {
    // 31.12.2021 (п'ятниця — робочий день)
    USD: { nbu: 27.2753, commercial: { buy: 27.00,  sell: 27.60  } },
    EUR: { nbu: 30.9392, commercial: { buy: 30.60,  sell: 31.30  } },
  },
  2022: {
    // 30.12.2022 (п'ятниця — останній робочий день, 31.12 — субота)
    // Після переходу на фіксований курс (02.2022) НБУ утримував 36.5686
    USD: { nbu: 36.5686, commercial: { buy: 36.20,  sell: 37.10  } },
    EUR: { nbu: 39.0027, commercial: { buy: 38.60,  sell: 39.60  } },
  },
  2023: {
    // 29.12.2023 (п'ятниця — останній робочий день)
    USD: { nbu: 37.9892, commercial: { buy: 37.70,  sell: 38.40  } },
    EUR: { nbu: 42.2394, commercial: { buy: 41.80,  sell: 42.90  } },
  },
  2024: {
    // 31.12.2024 (вівторок — робочий день)
    USD: { nbu: 42.0390, commercial: { buy: 42.00,  sell: 42.60  } },
    EUR: { nbu: 43.9266, commercial: { buy: 43.60,  sell: 44.40  } },
  },
  2025: {
    // 31.12.2025 (середа — робочий день)
    USD: { nbu: 42.3532, commercial: { buy: 42.10,  sell: 42.90  } },
    EUR: { nbu: 49.7947, commercial: { buy: 49.30,  sell: 50.40  } },
  },
  2026: {
    // Поточний (оновлюється через live API, нижче — fallback на момент написання)
    USD: { nbu: null,    commercial: { buy: null,   sell: null   } },
    EUR: { nbu: null,    commercial: { buy: null,   sell: null   } },
  },
};

function convertCurrency(amount, from, to, year, rateType = "nbu") {
  const fromUpper = from.toUpperCase();
  const toUpper   = to.toUpperCase();
 
  if (fromUpper === toUpper) return amount;
 
  // ── Архівний режим (синхронний) ──────────────────────────────────────────
  if (!year) throw new Error('Вкажіть рік (options.year) або увімкніть useLiveApi: true');
  if (!RATES_ARCHIVE[year]) {
    throw new Error(`Архівні дані за ${year} рік відсутні. Доступні роки: ${Object.keys(RATES_ARCHIVE).join(", ")}`);
  }
 
  /**
   * Повертає курс НБУ або комерційний курс для заданої валюти та року.
   */
  function getRate(currency) {
    const entry = RATES_ARCHIVE[year][currency];
    if (!entry) throw new Error(`Валюта ${currency} не підтримується`);
    if (rateType === "nbu") {
      if (entry.nbu === null) throw new Error(`Архівний курс НБУ за ${year} ще не встановлено`);
      return entry.nbu;
    }
    if (rateType === "commercial_buy")  return entry.commercial.buy;
    if (rateType === "commercial_sell") return entry.commercial.sell;
    throw new Error(`Невідомий тип курсу: "${rateType}". Використовуйте "nbu", "commercial_buy" або "commercial_sell"`);
  }
 
  // UAH → іноземна
  if (fromUpper === "UAH") {
    return amount / getRate(toUpper);
  }
  // іноземна → UAH
  if (toUpper === "UAH") {
    return amount * getRate(fromUpper);
  }
  // іноземна → іноземна (через UAH)
  return (amount * getRate(fromUpper)) / getRate(toUpper);
}
 