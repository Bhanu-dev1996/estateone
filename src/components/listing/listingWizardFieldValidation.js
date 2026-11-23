import { isValidPhone } from '../../lib/phone';

/** Single-field error message for a wizard step, or null if valid. */
export function getListingWizardFieldError(step, field, formData) {
  if (step === 1 && field === 'purpose') {
    return formData.purpose ? null : 'Please select a listing goal.';
  }

  if (step === 2 && field === 'propertyType') {
    return formData.propertyType ? null : 'Please choose a property category.';
  }

  if (step === 3) {
    if (field === 'title') {
      const t = formData.title?.trim() ?? '';
      if (!t || t.length < 8) {
        return 'Please enter a descriptive property title (minimum 8 characters).';
      }
      return null;
    }
    if (field === 'carpetArea' || field === 'builtUpArea') {
      if (!formData.carpetArea && !formData.builtUpArea) {
        return 'Please enter carpet area or built up area in square feet.';
      }
      return null;
    }
    if (field === 'description') {
      const d = formData.description?.trim() ?? '';
      if (!d || d.length < 15) {
        return 'Please provide a short description highlighting property features.';
      }
      return null;
    }
  }

  if (step === 4) {
    if (field === 'city') {
      return formData.city ? null : 'Please select a city.';
    }
    if (field === 'locality') {
      return formData.locality?.trim() ? null : 'Please enter the locality or sub market.';
    }
    if (field === 'fullAddress') {
      const a = formData.fullAddress?.trim() ?? '';
      if (!a || a.length < 5) {
        return 'Please enter the property building name and address.';
      }
      return null;
    }
  }

  if (step === 5) {
    if (formData.purpose === 'sell' && field === 'expectedPrice' && !formData.expectedPrice?.trim()) {
      return 'Please enter expected sale price.';
    }
    if (formData.purpose === 'rent') {
      if (field === 'monthlyRent' && !formData.monthlyRent?.trim()) {
        return 'Please enter monthly rent.';
      }
      if (field === 'securityDeposit' && !formData.securityDeposit?.trim()) {
        return 'Please enter security deposit.';
      }
    }
    if (formData.purpose === 'lease' && field === 'expectedPrice') {
      const ok =
        formData.expectedPrice?.trim() ||
        formData.monthlyRent?.trim() ||
        formData.leaseRatePerSqFt?.trim();
      if (!ok) return 'Please specify commercial lease rate or monthly valuation.';
    }
  }

  if (step === 6 && field === 'images') {
    if (!formData.images?.length) return 'Please upload or pick at least one property photo.';
  }

  if (step === 7) {
    if (field === 'submitterName' && !formData.submitterName?.trim()) {
      return 'Please enter your full name.';
    }
    if (field === 'submitterPhone') {
      if (!isValidPhone(formData.submitterPhone)) {
        return 'Please enter a valid mobile number for the selected country.';
      }
      return null;
    }
    if (field === 'submitterEmail') {
      if (!formData.submitterEmail?.trim() || !formData.submitterEmail.includes('@')) {
        return 'Please enter a valid email address.';
      }
    }
    if (field === 'companyName') {
      const needsCompany =
        formData.submitterRole === 'Licensed Agent' || formData.submitterRole === 'Builder or Developer';
      if (needsCompany && !formData.companyName?.trim()) {
        return 'Please enter your company or agency name.';
      }
    }
  }

  if (step === 8) {
    if (field === 'agreeTruthful' && !formData.agreeTruthful) {
      return 'You must confirm that all listing details are truthful.';
    }
    if (field === 'agreePrivacy' && !formData.agreePrivacy) {
      return 'You must accept the terms and privacy consent.';
    }
  }

  return null;
}

/** Drop resolved errors after the user edits fields (and on blur via the same check). */
export function reconcileErrorsAfterPatch(step, errors, formData, patchedKeys) {
  if (!errors || Object.keys(errors).length === 0) return errors;

  const next = { ...errors };
  const keysToReconcile = new Set(patchedKeys);

  if (step === 3 && (keysToReconcile.has('carpetArea') || keysToReconcile.has('builtUpArea'))) {
    keysToReconcile.add('carpetArea');
    keysToReconcile.add('builtUpArea');
  }

  if (step === 5 && formData.purpose === 'lease') {
    if (
      keysToReconcile.has('expectedPrice') ||
      keysToReconcile.has('monthlyRent') ||
      keysToReconcile.has('leaseRatePerSqFt')
    ) {
      keysToReconcile.add('expectedPrice');
    }
  }

  for (const key of keysToReconcile) {
    if (!(key in next)) continue;
    if (!getListingWizardFieldError(step, key, formData)) {
      delete next[key];
    }
  }

  return next;
}

export function reconcileFieldOnBlur(step, errors, formData, field) {
  return reconcileErrorsAfterPatch(step, errors, formData, [field]);
}