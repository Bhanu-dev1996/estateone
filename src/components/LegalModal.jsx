import React from 'react';
import { ShieldCheck } from '@phosphor-icons/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';

export default function LegalModal({ title, type, onClose }) {
  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white border-0 shadow-2xl p-6">
        <DialogHeader className="text-left pb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-brand-blue" />
            <DialogTitle className="heading-5 text-brand-navy font-bold">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="caption-3 text-brand-muted">
            Official EstateOne platform terms and compliance disclosures
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm text-brand-text leading-relaxed text-left py-2">
          {type === 'privacy' && (
            <>
              <p>
                EstateOne respects your privacy and is committed to protecting your personal information. This Privacy Policy details how we handle the contact details you provide when requesting site visits or enquiring about property listings.
              </p>
              <h4 className="title-3 text-brand-navy font-semibold pt-2">Information collection</h4>
              <p>
                We only collect your name, phone number, and email address when you voluntarily submit an enquiry or schedule a property walkthrough. We do not sell your personal data to mass telemarketing databases or unverified third parties.
              </p>
              <h4 className="title-3 text-brand-navy font-semibold pt-2">Use of information</h4>
              <p>
                Your contact details are shared exclusively with the verified listing advisor or property owner responsible for the specific unit you requested to visit.
              </p>
              <h4 className="title-3 text-brand-navy font-semibold pt-2">Data security</h4>
              <p>
                All communications and visitor scheduling records are stored using encrypted protocols with strict role based access limitations.
              </p>
            </>
          )}

          {type === 'rera' && (
            <>
              <p>
                EstateOne complies with the provisions of the Real Estate (Regulation and Development) Act, 2016 (RERA) and rules framed thereunder by respective State Authorities.
              </p>
              <h4 className="title-3 text-brand-navy font-semibold pt-2">Verification scope</h4>
              <p>
                Every residential and commercial project featured on EstateOne includes its official State RERA registration number and sanctioned plans as filed with the competent authority (such as MahaRERA, Karnataka RERA, Telengana RERA, and HRERA).
              </p>
              <h4 className="title-3 text-brand-navy font-semibold pt-2">Buyer due diligence</h4>
              <p>
                While EstateOne performs rigorous primary checks, prospective buyers are urged to independently review project details, payment terms, and builder track records on the respective official state RERA online portal before executing binding sale agreements or paying booking tokens.
              </p>
              <h4 className="title-3 text-brand-navy font-semibold pt-2">Platform status</h4>
              <p>
                EstateOne operates as a verified discovery marketplace connecting consumers with licensed real estate agents, builders, and title owners.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <p>
                Welcome to EstateOne. By accessing our platform, you agree to comply with our terms and conditions governing property discovery and site visit coordination.
              </p>
              <h4 className="title-3 text-brand-navy font-semibold pt-2">Platform role and verification</h4>
              <p>
                EstateOne acts as an authentic property discovery directory. While we perform stringent RERA documentation checks and physical inspections, visitors are advised to perform independent legal title due diligence through competent legal counsel before executing financial transactions.
              </p>
              <h4 className="title-3 text-brand-navy font-semibold pt-2">Zero fee browsing</h4>
              <p>
                Searching properties, reviewing verified credentials, and scheduling appointments through EstateOne are completely free for prospective buyers and tenants.
              </p>
              <h4 className="title-3 text-brand-navy font-semibold pt-2">Listing authenticity</h4>
              <p>
                Property owners and builders warrant that all title representations, carpet area measurements, and pricing schedules provided are accurate and legally compliant.
              </p>
            </>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
          <Button type="button" onClick={onClose} size="sm" className="rounded-full px-6 cursor-pointer">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
