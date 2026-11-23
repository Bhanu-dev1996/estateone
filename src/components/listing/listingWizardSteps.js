export const LISTING_WIZARD_STEPS = [
  {
    id: 1,
    short: 'Purpose',
    title: 'Listing purpose',
    hint: 'Choose sell, rent out, or commercial lease',
  },
  {
    id: 2,
    short: 'Type',
    title: 'Property category',
    hint: 'Pick the type on your deed or RERA filing',
  },
  {
    id: 3,
    short: 'Details',
    title: 'Property specifications',
    hint: 'Rooms, area, amenities',
  },
  {
    id: 4,
    short: 'Location',
    title: 'Location and territory',
    hint: 'City and address',
  },
  {
    id: 5,
    short: 'Pricing',
    title: 'Pricing and commercial terms',
    hint: 'Price, rent, charges',
  },
  {
    id: 6,
    short: 'Media',
    title: 'Photos and floor plans',
    hint: 'Photos and floor plans',
  },
  {
    id: 7,
    short: 'Contact',
    title: 'Owner and advisor details',
    hint: 'Owner contact details',
  },
  {
    id: 8,
    short: 'Review',
    title: 'Review and submit',
    hint: 'Check and submit',
  },
];

export function getWizardStepMeta(step) {
  return LISTING_WIZARD_STEPS.find((s) => s.id === step) ?? LISTING_WIZARD_STEPS[0];
}