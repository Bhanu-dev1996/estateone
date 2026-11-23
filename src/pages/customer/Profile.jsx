import React, { useState } from 'react';
import { 
  UserCircle, 
  ShieldCheck, 
  Envelope, 
  Phone, 
  CheckCircle, 
  PencilSimple, 
  FloppyDisk, 
  X, 
  Camera, 
  MapPin, 
  HouseLine, 
  CurrencyInr,
  Sparkle
} from '@phosphor-icons/react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useCustomerDashboard } from '../../context/CustomerDashboardContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { DashboardPageHeader } from '../../components/dashboard/dashboardUi';
import { PhoneInput } from '../../components/ui/phone-input';
import { isValidPhone, toStoredPhone } from '../../lib/phone';

export default function Profile() {
  const { profile, updateProfile } = useCustomerDashboard();
  const { user } = useAuth();
  const { toastSuccess, toastInfo } = useToast();

  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [firstName, setFirstName] = useState(profile.firstName || 'Ananya');
  const [lastName, setLastName] = useState(profile.lastName || 'Rao');
  const [email, setEmail] = useState(profile.email || 'buyer@estateone.in');
  const [phone, setPhone] = useState(toStoredPhone(profile.phone || '9820111223'));
  const [preferredContactMethod, setPreferredContactMethod] = useState(profile.preferredContactMethod || 'Email and WhatsApp');
  const [preferredLanguage, setPreferredLanguage] = useState(profile.preferredLanguage || 'English');
  const [intent, setIntent] = useState(profile.intent || 'buy');
  const [preferredLocations, setPreferredLocations] = useState(profile.preferredLocations?.join(', ') || 'Worli, Bandra West, Whitefield');
  const [preferredTypes, setPreferredTypes] = useState(profile.preferredTypes?.join(', ') || 'Penthouse, Apartment');
  const [preferredBedrooms, setPreferredBedrooms] = useState(profile.preferredBedrooms || '4 BHK');
  const [minBudget, setMinBudget] = useState(profile.minBudget || 100000000);
  const [maxBudget, setMaxBudget] = useState(profile.maxBudget || 450000000);

  const [errors, setErrors] = useState({});

  const handleSave = (e) => {
    e.preventDefault();
    const errs = {};
    if (!firstName.trim()) errs.firstName = 'First name is required.';
    if (!lastName.trim()) errs.lastName = 'Last name is required.';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email is required.';
    if (!isValidPhone(phone)) errs.phone = 'Please enter a valid mobile number for the selected country.';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    updateProfile({
      firstName,
      lastName,
      email,
      phone,
      preferredContactMethod,
      preferredLanguage,
      intent,
      preferredLocations: preferredLocations.split(',').map((l) => l.trim()).filter(Boolean),
      preferredTypes: preferredTypes.split(',').map((t) => t.trim()).filter(Boolean),
      preferredBedrooms,
      minBudget: Number(minBudget),
      maxBudget: Number(maxBudget)
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFirstName(profile.firstName || 'Ananya');
    setLastName(profile.lastName || 'Rao');
    setEmail(profile.email || 'buyer@estateone.in');
    setPhone(toStoredPhone(profile.phone || '9820111223'));
    setPreferredContactMethod(profile.preferredContactMethod || 'Email and WhatsApp');
    setPreferredLanguage(profile.preferredLanguage || 'English');
    setIntent(profile.intent || 'buy');
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      
      {/* =========================================================================
          1. HEADER (PRD Section 16.1)
         ========================================================================= */}
      <DashboardPageHeader
        title="Customer profile and preferences"
        description="Maintain your verified contact details and property acquisition criteria for personalized recommendations."
        action={
          !isEditing ? (
            <Button type="button" size="sm" onClick={() => setIsEditing(true)} className="rounded-2xl min-h-10 px-4">
              <PencilSimple size={14} className="mr-1.5" />
              <span>Edit profile</span>
            </Button>
          ) : (
            <>
              <Button type="button" size="sm" variant="outline" onClick={handleCancel} className="rounded-2xl min-h-10 px-4">
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={handleSave} className="rounded-2xl min-h-10 px-4 bg-brand-blue hover:bg-blue-700">
                <FloppyDisk size={14} className="mr-1.5" />
                <span>Save changes</span>
              </Button>
            </>
          )
        }
      />

      {/* =========================================================================
          2. PROFILE OVERVIEW & VERIFICATION BADGES
         ========================================================================= */}
      <Card className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative">
            <img
              src={profile.avatar || user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={profile.firstName}
              className="w-20 h-20 rounded-3xl object-cover ring-2 ring-brand-blue/20"
            />
            <div className="absolute -bottom-1 -right-1 p-1.5 bg-brand-navy text-white rounded-full shadow-sm">
              <Camera size={14} />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-h3 font-bold text-brand-navy">
                {profile.firstName} {profile.lastName}
              </h2>
              <ShieldCheck size={20} className="text-brand-blue shrink-0" weight="fill" />
            </div>

            <p className="caption-2 text-slate-500 mt-0.5">
              Verified Marketplace Member • Member ID: {user?.id || 'usr-buyer-01'}
            </p>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-caption py-0.5">
                <CheckCircle size={12} weight="fill" className="mr-1" />
                <span>Email verified</span>
              </Badge>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-caption py-0.5">
                <CheckCircle size={12} weight="fill" className="mr-1" />
                <span>Mobile number verified</span>
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-brand-blue border-blue-200 text-caption py-0.5 capitalize">
                <span>Intent: {profile.intent}</span>
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* =========================================================================
          3. EDITABLE DETAILS / VIEW MODE
         ========================================================================= */}
      <form onSubmit={handleSave} className="estate-form-surface">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Personal Contact Information (PRD 16.1) */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
              <h3 className="text-h4 font-bold text-brand-navy">Personal information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="wizard-field-label text-brand-navy block mb-1">First name</label>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="listing-wizard-field-control w-full p-2.5 rounded-xl border border-slate-200"
                      />
                      {errors.firstName && <p className="text-caption text-rose-500 mt-1">{errors.firstName}</p>}
                    </div>
                  ) : (
                    <p className="text-xs font-semibold text-brand-navy p-2.5 bg-slate-50 rounded-xl">{profile.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="wizard-field-label text-brand-navy block mb-1">Last name</label>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="listing-wizard-field-control w-full p-2.5 rounded-xl border border-slate-200"
                      />
                      {errors.lastName && <p className="text-caption text-rose-500 mt-1">{errors.lastName}</p>}
                    </div>
                  ) : (
                    <p className="text-xs font-semibold text-brand-navy p-2.5 bg-slate-50 rounded-xl">{profile.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="wizard-field-label text-brand-navy block mb-1">Email address</label>
                {isEditing ? (
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="listing-wizard-field-control w-full p-2.5 rounded-xl border border-slate-200"
                    />
                    {errors.email && <p className="text-caption text-rose-500 mt-1">{errors.email}</p>}
                  </div>
                ) : (
                  <p className="text-xs font-semibold text-brand-navy p-2.5 bg-slate-50 rounded-xl">{profile.email}</p>
                )}
              </div>

              <div>
                <label className="wizard-field-label text-brand-navy block mb-1">Mobile number</label>
                {isEditing ? (
                  <div>
                    <PhoneInput
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      aria-invalid={Boolean(errors.phone)}
                      className="rounded-xl border-slate-200"
                      inputClassName="rounded-xl border-0 text-small p-2.5"
                    />
                    {errors.phone && <p className="text-caption text-rose-500 mt-1">{errors.phone}</p>}
                  </div>
                ) : (
                  <p className="text-xs font-semibold text-brand-navy p-2.5 bg-slate-50 rounded-xl">{profile.phone}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="wizard-field-label text-brand-navy block mb-1">Preferred contact method</label>
                  {isEditing ? (
                    <select
                      value={preferredContactMethod}
                      onChange={(e) => setPreferredContactMethod(e.target.value)}
                      className="listing-wizard-field-control w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="Email and WhatsApp">Email and WhatsApp</option>
                      <option value="Phone call">Phone call</option>
                      <option value="Email only">Email only</option>
                    </select>
                  ) : (
                    <p className="text-xs font-semibold text-brand-navy p-2.5 bg-slate-50 rounded-xl">{profile.preferredContactMethod}</p>
                  )}
                </div>

                <div>
                  <label className="wizard-field-label text-brand-navy block mb-1">Preferred language</label>
                  {isEditing ? (
                    <select
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value)}
                      className="listing-wizard-field-control w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                    </select>
                  ) : (
                    <p className="text-xs font-semibold text-brand-navy p-2.5 bg-slate-50 rounded-xl">{profile.preferredLanguage}</p>
                  )}
                </div>
              </div>

            </Card>
          </div>

          {/* Right Column: Search & Property Criteria (PRD 16.1) */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
              <h3 className="text-h4 font-bold text-brand-navy">Search and acquisition criteria</h3>

              <div>
                <label className="wizard-field-label text-brand-navy block mb-1">Primary marketplace intent</label>
                {isEditing ? (
                  <select
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                    className="w-full text-small p-2.5 rounded-xl border border-slate-200 bg-white capitalize"
                  >
                    <option value="buy">Purchase property (Buyer)</option>
                    <option value="rent">Rent property (Tenant)</option>
                    <option value="explore">Explore both options</option>
                  </select>
                ) : (
                  <p className="text-xs font-semibold text-brand-navy p-2.5 bg-slate-50 rounded-xl capitalize">
                    {profile.intent === 'buy' ? 'Looking to purchase (Buyer)' : 'Looking to rent (Tenant)'}
                  </p>
                )}
              </div>

              <div>
                <label className="wizard-field-label text-brand-navy block mb-1">Preferred localities and cities</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={preferredLocations}
                    onChange={(e) => setPreferredLocations(e.target.value)}
                    placeholder="e.g. Worli, Bandra West, Whitefield"
                    className="listing-wizard-field-control w-full p-2.5 rounded-xl border border-slate-200"
                  />
                ) : (
                  <div className="flex items-center gap-1.5 flex-wrap p-2.5 bg-slate-50 rounded-xl">
                    {profile.preferredLocations?.map((loc) => (
                      <span key={loc} className="text-xs font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded-md text-brand-navy">
                        {loc}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="wizard-field-label text-brand-navy block mb-1">Preferred property types</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={preferredTypes}
                      onChange={(e) => setPreferredTypes(e.target.value)}
                      placeholder="e.g. Penthouse, Villa, Apartment"
                      className="listing-wizard-field-control w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  ) : (
                    <p className="text-xs font-semibold text-brand-navy p-2.5 bg-slate-50 rounded-xl">
                      {profile.preferredTypes?.join(', ')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="wizard-field-label text-brand-navy block mb-1">Preferred bedrooms</label>
                  {isEditing ? (
                    <select
                      value={preferredBedrooms}
                      onChange={(e) => setPreferredBedrooms(e.target.value)}
                      className="listing-wizard-field-control w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                      <option value="4 BHK">4+ BHK</option>
                    </select>
                  ) : (
                    <p className="text-xs font-semibold text-brand-navy p-2.5 bg-slate-50 rounded-xl">
                      {profile.preferredBedrooms}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="wizard-field-label text-brand-navy block mb-1">Min budget</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={minBudget}
                      onChange={(e) => setMinBudget(e.target.value)}
                      className="listing-wizard-field-control w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  ) : (
                    <p className="text-xs font-semibold text-brand-navy p-2.5 bg-slate-50 rounded-xl">
                      ₹{(profile.minBudget / 10000000).toFixed(2)} Cr
                    </p>
                  )}
                </div>

                <div>
                  <label className="wizard-field-label text-brand-navy block mb-1">Max budget</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value)}
                      className="listing-wizard-field-control w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  ) : (
                    <p className="text-xs font-semibold text-brand-navy p-2.5 bg-slate-50 rounded-xl">
                      ₹{(profile.maxBudget / 10000000).toFixed(2)} Cr
                    </p>
                  )}
                </div>
              </div>

            </Card>
          </div>

        </div>
      </form>

    </div>
  );
}
