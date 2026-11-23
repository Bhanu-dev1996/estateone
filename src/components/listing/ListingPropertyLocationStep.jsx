import React from 'react';
import { MapPin } from '@phosphor-icons/react';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { CITIES } from '../../data/properties';
import {
  WizardFormField,
  WizardSelectField,
  wizardFieldControlClass,
  wizardInputErrorClass,
} from './WizardFormFields';
import { cn } from '../../lib/utils';

const INDIAN_STATES = [
  'Maharashtra',
  'Karnataka',
  'Telangana',
  'Delhi NCR',
  'Tamil Nadu',
  'Goa',
  'Gujarat',
  'West Bengal',
  'Rajasthan',
  'Uttar Pradesh',
];

const CITY_OPTIONS = CITIES.filter((c) => c !== 'All cities');

const BLUR_VALIDATED_FIELDS = new Set(['locality', 'fullAddress']);

export default function ListingPropertyLocationStep({ formData, errors, onPatch, onFieldBlur }) {
  const blurValidate = (field) => () => {
    if (BLUR_VALIDATED_FIELDS.has(field)) {
      onFieldBlur?.(field);
    }
  };

  const localityPreview = formData.locality?.trim() || formData.city || 'your city';

  return (
    <fieldset className="border-0 p-0 m-0 min-w-0 space-y-5">
      <legend className="sr-only">Property location</legend>
      <p className="wizard-step-assist text-caption font-normal text-slate-500 mb-0 text-pretty">
        Buyers search by city and locality first. Match how the address appears on official records.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <WizardFormField id="country" label="Country">
          <Input
            id="country"
            type="text"
            disabled
            value={formData.country}
            className={cn(wizardFieldControlClass, 'cursor-not-allowed bg-slate-100 text-slate-500')}
          />
        </WizardFormField>

        <WizardSelectField
          id="state"
          label="State *"
          value={formData.state}
          onValueChange={(state) => onPatch({ state })}
          options={INDIAN_STATES}
        />

        <WizardSelectField
          id="city"
          label="City *"
          value={formData.city}
          onValueChange={(city) => onPatch({ city })}
          options={CITY_OPTIONS}
          error={errors.city}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <WizardFormField id="locality" label="Locality or neighborhood *" error={errors.locality}>
          <Input
            id="locality"
            type="text"
            placeholder="e.g. Worli Sea Face, Bandra West, Whitefield"
            value={formData.locality}
            onChange={(e) => onPatch({ locality: e.target.value })}
            onBlur={blurValidate('locality')}
            aria-invalid={Boolean(errors.locality)}
            className={cn(wizardFieldControlClass, wizardInputErrorClass(errors, 'locality'))}
          />
        </WizardFormField>

        <WizardFormField id="pincode" label="Postal PIN code">
          <Input
            id="pincode"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 400018"
            value={formData.pincode}
            onChange={(e) => onPatch({ pincode: e.target.value })}
            className={wizardFieldControlClass}
          />
        </WizardFormField>
      </div>

      <WizardFormField id="full-address" label="Full address (Building, Wing, Road) *" error={errors.fullAddress}>
        <Textarea
          id="full-address"
          rows={2}
          placeholder="e.g. Tower 2, Horizon Promenade, Dr. Annie Besant Road"
          value={formData.fullAddress}
          onChange={(e) => onPatch({ fullAddress: e.target.value })}
          onBlur={blurValidate('fullAddress')}
          aria-invalid={Boolean(errors.fullAddress)}
          className={cn(wizardFieldControlClass, wizardInputErrorClass(errors, 'fullAddress'))}
        />
      </WizardFormField>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white">
            <MapPin size={20} weight="fill" className="text-brand-blue" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-small font-semibold text-brand-navy">Geographic pin preview</p>
            <p className="text-caption text-slate-500 text-pretty">
              Coordinates mapped to {localityPreview}, India
            </p>
          </div>
        </div>
        <Badge variant="default" className="shrink-0 text-caption font-medium">
          Coordinates verified
        </Badge>
      </div>
    </fieldset>
  );
}