import React from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlass, HouseLine } from '@phosphor-icons/react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export default function NotFoundPage() {
  return (
    <div className="pt-36 pb-24 px-4 max-w-xl mx-auto text-center">
      <Card className="p-10 rounded-3xl bg-white/80 backdrop-blur-2xl border-0 shadow-lg space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mx-auto">
          <HouseLine size={36} weight="duotone" />
        </div>

        <div>
          <h1 className="heading-1 text-brand-navy font-bold mb-2">Page not found</h1>
          <p className="body-3 text-brand-muted">
            The property or resource you are looking for has been relocated, archived, or does not exist.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="w-full sm:w-auto">
            <Button size="lg" className="w-full rounded-full">
              Return to home
            </Button>
          </Link>
          <Link to="/buy" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full rounded-full border-slate-200 text-brand-navy">
              Browse properties
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
