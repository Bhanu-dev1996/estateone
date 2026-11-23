import React from 'react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cn } from '../../lib/utils';

export const estateFormSurfaceClass = 'estate-form-surface';

export const wizardFieldControlClass =
  'listing-wizard-field-control text-small placeholder:text-caption placeholder:font-normal';

export function WizardFormField({ id, label, hint, error, children, className }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={id} className="wizard-field-label text-caption font-medium leading-snug">
        {label}
      </Label>
      {children}
      {hint ? <p className="wizard-field-hint text-caption text-slate-500">{hint}</p> : null}
      {error ? <p className="wizard-field-error">{error}</p> : null}
    </div>
  );
}

export function WizardSelectField({ id, label, hint, error, value, onValueChange, options, placeholder, disabled }) {
  return (
    <WizardFormField id={id} label={label} hint={hint} error={error}>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          id={id}
          aria-invalid={Boolean(error)}
          disabled={disabled}
          className={cn(wizardFieldControlClass, error && 'border-rose-500 focus:ring-rose-500/30')}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </WizardFormField>
  );
}

export function wizardInputErrorClass(errors, key) {
  return cn(errors[key] && 'border-rose-500 focus-visible:ring-rose-500/30');
}