import React, { useEffect, useState } from 'react';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger } from './select';
import { cn } from '../../lib/utils';
import {
  formatNationalDisplay,
  parseStoredPhone,
  toStoredPhone,
  getPhoneCountry,
  PHONE_COUNTRIES,
} from '../../lib/phone';

export const PhoneInput = React.forwardRef(
  (
    {
      className,
      inputClassName,
      value,
      onChange,
      onBlur,
      id,
      disabled,
      disableCountrySelect = false,
      defaultCountryId,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref
  ) => {
    const stored = parseStoredPhone(value);
    const [countryId, setCountryId] = useState(defaultCountryId ?? stored.countryId);
    const country = getPhoneCountry(countryId);
    const national = stored.countryId === countryId ? stored.national : '';

    useEffect(() => {
      setCountryId(parseStoredPhone(value).countryId);
    }, [value]);

    const emit = (nextCountryId, nextNational) => {
      const stored = toStoredPhone(nextCountryId, nextNational);
      onChange?.({
        target: { value: stored, name: props.name },
      });
    };

    const handleCountryChange = (nextId) => {
      setCountryId(nextId);
      const currentNational = parseStoredPhone(value).national;
      emit(nextId, currentNational);
    };

    const handleNationalChange = (e) => {
      const c = getPhoneCountry(countryId);
      const nextNational = digitsOnly(e.target.value).slice(0, c.nationalMax);
      emit(countryId, nextNational);
    };

    function digitsOnly(v) {
      return String(v ?? '').replace(/\D/g, '');
    }

    return (
      <div
        className={cn(
          'phone-input flex w-full overflow-hidden rounded-lg border border-brand-border bg-white transition-brand-fast focus-within:ring-2 focus-within:ring-brand-blue',
          ariaInvalid && 'border-rose-500 focus-within:ring-rose-500/30',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        {disableCountrySelect ? (
          <span
            className="phone-input-country-static listing-wizard-field-control inline-flex h-10 shrink-0 items-center border-r border-brand-border bg-slate-50 px-2.5 tabular-nums font-normal text-brand-navy"
            aria-hidden
          >
            {country.code}
          </span>
        ) : (
          <Select value={countryId} onValueChange={handleCountryChange} disabled={disabled}>
            <SelectTrigger
              aria-label="Country code"
              className={cn(
                'phone-input-country-trigger h-10 w-[5.25rem] shrink-0 justify-center gap-0 rounded-none border-0 border-r border-brand-border bg-slate-50 px-1.5 tabular-nums font-normal text-brand-navy shadow-none focus:ring-0',
                '[&_svg]:size-3 [&_svg]:shrink-0 [&_svg]:text-slate-400',
                'data-[state=open]:bg-slate-100'
              )}
            >
              <span className="text-small">{country.code}</span>
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {PHONE_COUNTRIES.map((c) => (
                <SelectItem key={c.id} value={c.id} className="text-small">
                  {c.code} · {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Input
          ref={ref}
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          disabled={disabled}
          aria-invalid={ariaInvalid}
          placeholder={country.placeholder}
          value={formatNationalDisplay(national, countryId)}
          onChange={handleNationalChange}
          onBlur={onBlur}
          className={cn(
            'listing-wizard-field-control min-w-0 flex-1 rounded-none border-0 bg-white px-3 text-small shadow-none focus-visible:ring-0',
            inputClassName
          )}
          {...props}
        />
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';