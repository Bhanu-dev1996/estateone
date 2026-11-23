import {
  DEFAULT_PHONE_COUNTRY_ID,
  getPhoneCountry,
  matchCountryByDigits,
  PHONE_COUNTRIES,
} from './phoneCountries';

export { PHONE_COUNTRIES, DEFAULT_PHONE_COUNTRY_ID, getPhoneCountry };

/** @deprecated use getPhoneCountry('IN').code */
export const PHONE_COUNTRY_CODE = '+91';
/** @deprecated */
export const PHONE_COUNTRY_DIAL = '91';

export function digitsOnly(value) {
  return String(value ?? '').replace(/\D/g, '');
}

export function parseStoredPhone(value) {
  const raw = String(value ?? '').trim();
  if (!raw) {
    return { countryId: DEFAULT_PHONE_COUNTRY_ID, national: '' };
  }

  const allDigits = digitsOnly(raw);
  const matched = matchCountryByDigits(allDigits);
  if (matched) {
    return { countryId: matched.country.id, national: matched.national };
  }

  if (raw.startsWith('+')) {
    const afterPlus = digitsOnly(raw);
    const again = matchCountryByDigits(afterPlus);
    if (again) {
      return { countryId: again.country.id, national: again.national };
    }
  }

  const india = getPhoneCountry(DEFAULT_PHONE_COUNTRY_ID);
  return {
    countryId: DEFAULT_PHONE_COUNTRY_ID,
    national: allDigits.slice(0, india.nationalMax),
  };
}

export function formatNationalDisplay(national, countryId = DEFAULT_PHONE_COUNTRY_ID) {
  const n = digitsOnly(national);
  if (!n) return '';
  const c = getPhoneCountry(countryId);
  if (c.id === 'IN' && n.length > 5) {
    return `${n.slice(0, 5)} ${n.slice(5)}`;
  }
  if (n.length > 4) {
    return `${n.slice(0, Math.ceil(n.length / 2))} ${n.slice(Math.ceil(n.length / 2))}`;
  }
  return n;
}

/** Stored E.164: `+{dial}{national}` */
export function toStoredPhone(countryIdOrValue, nationalMaybe) {
  if (nationalMaybe === undefined && typeof countryIdOrValue === 'string') {
    const raw = countryIdOrValue.trim();
    if (raw && !raw.startsWith('+') && digitsOnly(raw).length <= getPhoneCountry(DEFAULT_PHONE_COUNTRY_ID).nationalMax) {
      return toStoredPhone(DEFAULT_PHONE_COUNTRY_ID, raw);
    }
    const parsed = parseStoredPhone(countryIdOrValue);
    if (!parsed.national) return '';
    return toStoredPhone(parsed.countryId, parsed.national);
  }
  const c = getPhoneCountry(countryIdOrValue);
  const n = digitsOnly(nationalMaybe).slice(0, c.nationalMax);
  if (!n) return '';
  return `${c.code}${n}`;
}

export function formatPhoneDisplay(value) {
  const { countryId, national } = parseStoredPhone(value);
  const c = getPhoneCountry(countryId);
  const n = digitsOnly(national);
  if (!n) return '';
  return `${c.code} ${formatNationalDisplay(n, countryId)}`;
}

export function isValidPhone(value) {
  const { countryId, national } = parseStoredPhone(value);
  const c = getPhoneCountry(countryId);
  const n = digitsOnly(national);
  if (n.length < c.min || n.length > c.nationalMax) return false;
  if (c.pattern && !c.pattern.test(n)) return false;
  return true;
}

/** @deprecated use parseStoredPhone */
export function nationalDigits(value) {
  return parseStoredPhone(value).national;
}

export function isValidIndiaMobile(value) {
  const { countryId, national } = parseStoredPhone(value);
  if (countryId !== 'IN') return false;
  const c = getPhoneCountry('IN');
  const n = digitsOnly(national);
  return n.length === c.min && (!c.pattern || c.pattern.test(n));
}

export function isValidIndiaPhoneLoose(value) {
  const { countryId, national } = parseStoredPhone(value);
  const c = getPhoneCountry(countryId);
  const n = digitsOnly(national);
  return n.length >= Math.min(8, c.min);
}