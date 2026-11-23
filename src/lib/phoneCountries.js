/** Dial plans for PhoneInput (E.164 storage: +{dial}{national}). */
export const PHONE_COUNTRIES = [
  {
    id: 'IN',
    dial: '91',
    code: '+91',
    label: 'India',
    nationalMax: 10,
    min: 10,
    placeholder: '98765 43210',
    pattern: /^[6-9]\d{9}$/,
  },
  {
    id: 'AE',
    dial: '971',
    code: '+971',
    label: 'UAE',
    nationalMax: 9,
    min: 9,
    placeholder: '501234567',
  },
  {
    id: 'SG',
    dial: '65',
    code: '+65',
    label: 'Singapore',
    nationalMax: 8,
    min: 8,
    placeholder: '91234567',
  },
  {
    id: 'US',
    dial: '1',
    code: '+1',
    label: 'United States',
    nationalMax: 10,
    min: 10,
    placeholder: '4155552671',
  },
  {
    id: 'CA',
    dial: '1',
    code: '+1',
    label: 'Canada',
    nationalMax: 10,
    min: 10,
    placeholder: '4165552671',
  },
  {
    id: 'GB',
    dial: '44',
    code: '+44',
    label: 'United Kingdom',
    nationalMax: 10,
    min: 10,
    placeholder: '7911123456',
  },
  {
    id: 'AU',
    dial: '61',
    code: '+61',
    label: 'Australia',
    nationalMax: 9,
    min: 9,
    placeholder: '412345678',
  },
  {
    id: 'SA',
    dial: '966',
    code: '+966',
    label: 'Saudi Arabia',
    nationalMax: 9,
    min: 9,
    placeholder: '512345678',
  },
  {
    id: 'QA',
    dial: '974',
    code: '+974',
    label: 'Qatar',
    nationalMax: 8,
    min: 8,
    placeholder: '33123456',
  },
  {
    id: 'OM',
    dial: '968',
    code: '+968',
    label: 'Oman',
    nationalMax: 8,
    min: 8,
    placeholder: '92123456',
  },
  {
    id: 'KW',
    dial: '965',
    code: '+965',
    label: 'Kuwait',
    nationalMax: 8,
    min: 8,
    placeholder: '50123456',
  },
  {
    id: 'BH',
    dial: '973',
    code: '+973',
    label: 'Bahrain',
    nationalMax: 8,
    min: 8,
    placeholder: '36123456',
  },
  {
    id: 'NP',
    dial: '977',
    code: '+977',
    label: 'Nepal',
    nationalMax: 10,
    min: 10,
    placeholder: '9841234567',
  },
  {
    id: 'BD',
    dial: '880',
    code: '+880',
    label: 'Bangladesh',
    nationalMax: 10,
    min: 10,
    placeholder: '1712345678',
  },
  {
    id: 'LK',
    dial: '94',
    code: '+94',
    label: 'Sri Lanka',
    nationalMax: 9,
    min: 9,
    placeholder: '712345678',
  },
  {
    id: 'DE',
    dial: '49',
    code: '+49',
    label: 'Germany',
    nationalMax: 11,
    min: 10,
    placeholder: '15123456789',
  },
  {
    id: 'FR',
    dial: '33',
    code: '+33',
    label: 'France',
    nationalMax: 9,
    min: 9,
    placeholder: '612345678',
  },
];

export const DEFAULT_PHONE_COUNTRY_ID = 'IN';

const BY_ID = Object.fromEntries(PHONE_COUNTRIES.map((c) => [c.id, c]));
const BY_DIAL_DESC = [...PHONE_COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);

export function getPhoneCountry(countryId) {
  return BY_ID[countryId] ?? BY_ID[DEFAULT_PHONE_COUNTRY_ID];
}

export function matchCountryByDigits(digits) {
  for (const c of BY_DIAL_DESC) {
    if (digits.startsWith(c.dial) && digits.length > c.dial.length) {
      return {
        country: c,
        national: digits.slice(c.dial.length).slice(0, c.nationalMax),
      };
    }
  }
  return null;
}