import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Envelope, Phone, CheckCircle, ChatCircleDots } from '@phosphor-icons/react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'General enquiry',
    message: ''
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto text-left">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-brand-muted flex items-center gap-2">
        <Link to="/" className="hover:text-brand-navy">Home</Link>
        <span>/</span>
        <span className="font-semibold text-brand-navy">Contact us</span>
      </nav>

      <div className="mb-10 max-w-2xl">
        <Badge variant="default" className="mb-3">
          <ChatCircleDots size={16} weight="fill" className="text-brand-blue" />
          <span>Priority support</span>
        </Badge>
        <h1 className="heading-1 text-brand-navy tracking-tight mb-2">
          Get in touch with EstateOne
        </h1>
        <p className="body-4 text-brand-muted">
          Our client advisory and partnership team is available to assist buyers, tenants, owners, and developers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="p-8 rounded-3xl bg-white/80 backdrop-blur-2xl border-0 shadow-xs">
            {sent ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle size={36} weight="fill" />
                </div>
                <h2 className="heading-2 text-brand-navy font-bold">Message sent successfully</h2>
                <p className="body-3 text-brand-muted max-w-md mx-auto">
                  Thank you for reaching out, {formData.name}. Our advisory team will review your inquiry and respond within two hours.
                </p>
                <div className="pt-4">
                  <Button onClick={() => setSent(false)}>Send another inquiry</Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="caption-1 font-semibold text-brand-navy block mb-1">Your full name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                  <div>
                    <label className="caption-1 font-semibold text-brand-navy block mb-1">Email address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="caption-1 font-semibold text-brand-navy block mb-1">Mobile number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98000 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                  <div>
                    <label className="caption-1 font-semibold text-brand-navy block mb-1">Inquiry category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white"
                    >
                      <option>General enquiry</option>
                      <option>Buying property</option>
                      <option>Renting property</option>
                      <option>Listing a property</option>
                      <option>Builder or agent partnership</option>
                      <option>Technical support</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="caption-1 font-semibold text-brand-navy block mb-1">How can we help you?</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your property requirements, preferred locality, or inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-brand-navy focus:bg-white focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <Button type="submit" size="lg" className="rounded-full w-full sm:w-auto px-8 cursor-pointer">
                  Submit inquiry
                </Button>
              </form>
            )}
          </Card>
        </div>

        {/* Contact Info Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 rounded-3xl bg-white/70 backdrop-blur-md border-0 shadow-xs space-y-4">
            <h2 className="title-2 text-brand-navy font-semibold">Corporate headquarters</h2>
            <div className="space-y-3 text-xs text-brand-muted">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-blue shrink-0 mt-0.5" />
                <span>Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051, India</span>
              </div>
              <div className="flex items-center gap-3">
                <Envelope size={18} className="text-brand-blue shrink-0" />
                <span>contact@estateone.in</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-brand-blue shrink-0" />
                <span>+91 22 6120 4400</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-3xl bg-blue-50/60 border-0 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-brand-navy font-semibold text-xs">
              <ShieldCheck size={16} weight="fill" className="text-brand-blue" />
              <span>Dedicated verification desks</span>
            </div>
            <p className="caption-2 text-brand-muted leading-relaxed">
              In person physical inspection desks available across Mumbai, Bengaluru, Hyderabad, Pune, Chennai, and Delhi NCR.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
