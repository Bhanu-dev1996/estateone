import React from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { cn } from '../../lib/utils';
import {
  WizardFormField,
  WizardSelectField,
  wizardFieldControlClass,
  wizardInputErrorClass,
} from './WizardFormFields';

const BEDROOM_OPTIONS = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK', 'Studio'];
const BATHROOM_OPTIONS = ['1', '2', '3', '4', '5+'];
const FURNISHING_OPTIONS = ['Unfurnished', 'Semi furnished', 'Fully furnished'];
const PROPERTY_AGE_OPTIONS = [
  'Under construction',
  'Ready to move',
  '0 to 1 year',
  '1 to 5 years',
  '5 to 10 years',
  '10+ years',
];
const AVAILABILITY_OPTIONS = ['Immediate', 'Within 15 days', 'Within 30 days', 'Specific date'];
const FACING_OPTIONS = ['East', 'North', 'North East', 'West', 'South'];
const PARKING_OPTIONS = ['1 covered', '2 covered', '3+ covered', 'Open parking', 'None'];
const POWER_BACKUP_OPTIONS = ['100% full backup', 'Partial backup', 'None'];

const BLUR_VALIDATED_FIELDS = new Set(['title', 'carpetArea', 'builtUpArea', 'description']);

export default function ListingPropertyDetailsStep({ formData, errors, onPatch, onFieldBlur }) {
  const isResidentialLayout =
    formData.propertyType !== 'Plot' && formData.propertyType !== 'Commercial property';

  const blurValidate = (field) => () => {
    if (BLUR_VALIDATED_FIELDS.has(field)) {
      onFieldBlur?.(field);
    }
  };

  return (
    <fieldset className="border-0 p-0 m-0 min-w-0 space-y-5">
      <legend className="sr-only">Property specifications</legend>
      <p className="wizard-step-assist text-caption font-normal text-slate-500 mb-0 text-pretty">
        Use figures from sanctioned drawings or RERA disclosures where possible.
      </p>

      <WizardFormField id="listing-title" label="Property listing title *" error={errors.title}>
        <Input
          id="listing-title"
          type="text"
          placeholder="e.g. 4 BHK Seafront Penthouse with Private Deck"
          value={formData.title}
          onChange={(e) => onPatch({ title: e.target.value })}
          onBlur={blurValidate('title')}
          aria-invalid={Boolean(errors.title)}
          className={cn(wizardFieldControlClass, wizardInputErrorClass(errors, 'title'))}
        />
      </WizardFormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <WizardFormField
          id="carpet-area"
          label="Carpet area (sq ft) *"
          hint="RERA compliant net usable floor space"
          error={errors.carpetArea}
        >
          <Input
            id="carpet-area"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 2,450"
            value={formData.carpetArea}
            onChange={(e) => onPatch({ carpetArea: e.target.value })}
            onBlur={blurValidate('carpetArea')}
            aria-invalid={Boolean(errors.carpetArea)}
            className={cn(wizardFieldControlClass, wizardInputErrorClass(errors, 'carpetArea'))}
          />
        </WizardFormField>

        <WizardFormField
          id="built-up-area"
          label="Built up area (sq ft)"
          hint="Including walls and external conduits"
        >
          <Input
            id="built-up-area"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 3,100"
            value={formData.builtUpArea}
            onChange={(e) => onPatch({ builtUpArea: e.target.value })}
            onBlur={blurValidate('builtUpArea')}
            className={wizardFieldControlClass}
          />
        </WizardFormField>
      </div>

      {isResidentialLayout && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <WizardSelectField
            id="bedrooms"
            label="Bedrooms"
            value={formData.bedrooms}
            onValueChange={(bedrooms) => onPatch({ bedrooms })}
            options={BEDROOM_OPTIONS}
          />
          <WizardSelectField
            id="bathrooms"
            label="Bathrooms"
            value={formData.bathrooms}
            onValueChange={(bathrooms) => onPatch({ bathrooms })}
            options={BATHROOM_OPTIONS}
          />
          <WizardSelectField
            id="furnishing"
            label="Furnishing"
            value={formData.furnishing}
            onValueChange={(furnishing) => onPatch({ furnishing })}
            options={FURNISHING_OPTIONS}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <WizardFormField id="floor-number" label="Floor number">
          <Input
            id="floor-number"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 14"
            value={formData.floorNumber}
            onChange={(e) => onPatch({ floorNumber: e.target.value })}
            className={wizardFieldControlClass}
          />
        </WizardFormField>

        <WizardFormField id="total-floors" label="Total floors">
          <Input
            id="total-floors"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 32"
            value={formData.totalFloors}
            onChange={(e) => onPatch({ totalFloors: e.target.value })}
            className={wizardFieldControlClass}
          />
        </WizardFormField>

        <WizardSelectField
          id="property-age"
          label="Age of property"
          value={formData.propertyAge}
          onValueChange={(propertyAge) => onPatch({ propertyAge })}
          options={PROPERTY_AGE_OPTIONS}
        />

        <WizardSelectField
          id="availability"
          label="Availability"
          value={formData.availability}
          onValueChange={(availability) => onPatch({ availability })}
          options={AVAILABILITY_OPTIONS}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <WizardSelectField
          id="facing"
          label="Facing orientation"
          value={formData.facing}
          onValueChange={(facing) => onPatch({ facing })}
          options={FACING_OPTIONS}
        />
        <WizardSelectField
          id="parking"
          label="Reserved parking"
          value={formData.parkingSlots}
          onValueChange={(parkingSlots) => onPatch({ parkingSlots })}
          options={PARKING_OPTIONS}
        />
        <WizardSelectField
          id="power-backup"
          label="Power backup"
          value={formData.powerBackup}
          onValueChange={(powerBackup) => onPatch({ powerBackup })}
          options={POWER_BACKUP_OPTIONS}
        />
      </div>

      <WizardFormField
        id="listing-description"
        label="Full property description *"
        error={errors.description}
      >
        <Textarea
          id="listing-description"
          rows={4}
          placeholder="Describe the architectural highlights, interior specifications, view unobstructed angles, and society credentials..."
          value={formData.description}
          onChange={(e) => onPatch({ description: e.target.value })}
          onBlur={blurValidate('description')}
          aria-invalid={Boolean(errors.description)}
          className={cn(wizardFieldControlClass, wizardInputErrorClass(errors, 'description'))}
        />
      </WizardFormField>
    </fieldset>
  );
}