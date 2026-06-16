const RATES_ARCHIVE = {
  2014: {
    USD: { nbu: 15.768556, commercial: { buy: 15.60,  sell: 16.00  } },
    EUR: { nbu: 19.232908, commercial: { buy: 19.00,  sell: 19.60  } },
  },
  2015: {
    USD: { nbu: 24.000667, commercial: { buy: 23.80,  sell: 24.30  } },
    EUR: { nbu: 26.223129, commercial: { buy: 26.00,  sell: 26.70  } },
  },
  2016: {
    USD: { nbu: 27.190858, commercial: { buy: 27.00,  sell: 27.50  } },
    EUR: { nbu: 28.422604, commercial: { buy: 28.10,  sell: 28.90  } },
  },
  2017: {
    USD: { nbu: 28.067223, commercial: { buy: 27.85,  sell: 28.35  } },
    EUR: { nbu: 33.495424, commercial: { buy: 33.20,  sell: 34.00  } },
  },
  2018: {
    USD: { nbu: 27.688264, commercial: { buy: 27.50,  sell: 28.00  } },
    EUR: { nbu: 31.714138, commercial: { buy: 31.40,  sell: 32.10  } },
  },
  2019: {
    USD: { nbu: 23.6862, commercial: { buy: 23.50,  sell: 23.95  } },
    EUR: { nbu: 26.4220, commercial: { buy: 26.10,  sell: 26.80  } },
  },
  2020: {
    USD: { nbu: 28.2746, commercial: { buy: 28.05,  sell: 28.55  } },
    EUR: { nbu: 34.7396, commercial: { buy: 34.30,  sell: 35.10  } },
  },
  2021: {
    USD: { nbu: 27.2782, commercial: { buy: 27.00,  sell: 27.60  } },
    EUR: { nbu: 30.9226, commercial: { buy: 30.60,  sell: 31.30  } },
  },
  2022: {
    USD: { nbu: 36.5686, commercial: { buy: 36.20,  sell: 37.10  } },
    EUR: { nbu: 38.9510, commercial: { buy: 38.60,  sell: 39.60  } },
  },
  2023: {
    USD: { nbu: 37.9824, commercial: { buy: 37.70,  sell: 38.40  } },
    EUR: { nbu: 42.2079, commercial: { buy: 41.80,  sell: 42.90  } },
  },
  2024: {
    USD: { nbu: 42.0390, commercial: { buy: 42.00,  sell: 42.60  } },
    EUR: { nbu: 43.9266, commercial: { buy: 43.60,  sell: 44.40  } },
  },
  2025: {
    USD: { nbu: 42.3878, commercial: { buy: 42.10,  sell: 42.90  } },
    EUR: { nbu: 49.8565, commercial: { buy: 49.30,  sell: 50.40  } },
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
 