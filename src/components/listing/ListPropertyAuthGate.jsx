import React from 'react';
import { ShieldCheck, SignIn, UserPlus } from '@phosphor-icons/react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';

const BENEFITS = [
  {
    title: 'Serious buyers only',
    body: 'Inquiries come through verified coordinators, not anonymous forms.',
  },
  {
    title: 'Drafts stay saved',
    body: 'Sign in so your progress is tied to your account on any device.',
  },
  {
    title: 'Fast compliance review',
    body: 'Typical RERA and title checks complete within 24 to 48 hours.',
  },
];

export default function ListPropertyAuthGate({ onSignIn, onRegister, onDemoLogin }) {
  return (
    <Card className="overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-xs w-full text-left">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <CardHeader className="space-y-4 p-8 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-100">
          <Badge variant="default" className="w-fit gap-1.5 text-caption font-semibold">
            <ShieldCheck size={14} weight="fill" aria-hidden />
            Sign in required
          </Badge>
          <CardTitle className="text-h3 text-balance">Sign in to start your listing</CardTitle>
          <CardDescription className="text-body text-slate-600 text-pretty max-w-[65ch]">
            EstateOne lists only verified properties. An account lets you save drafts, upload
            documents, and track review status in one place.
          </CardDescription>
          <ul className="space-y-4 pt-2">
            {BENEFITS.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-gold" aria-hidden />
                <div>
                  <p className="text-small font-semibold text-brand-navy">{item.title}</p>
                  <p className="text-caption text-slate-500 mt-0.5 text-pretty">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardHeader>

        <CardContent className="flex flex-col justify-center p-8 sm:p-10 lg:p-12 bg-slate-50/80">
          <div className="mx-auto w-full max-w-sm space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-blue shadow-xs">
              <ShieldCheck size={28} weight="fill" aria-hidden />
            </div>
            <div>
              <CardTitle className="text-h4">Continue with your account</CardTitle>
              <CardDescription className="text-caption mt-1 text-pretty">
                Choose an option below. We will bring you back here after sign in.
              </CardDescription>
            </div>

            <div className="space-y-2.5 pt-2">
              <Button type="button" size="sm" onClick={onSignIn} className="w-full rounded-2xl shadow-xs">
                <SignIn size={18} weight="bold" />
                Sign in
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onRegister}
                className="w-full rounded-2xl border-slate-200"
              >
                <UserPlus size={18} weight="bold" />
                Create account
              </Button>
            </div>

            <Separator className="bg-slate-200/80" />
            <p className="text-caption text-slate-500">Trying the workflow?</p>
            <Button type="button" variant="ghost" size="sm" onClick={onDemoLogin} className="text-brand-blue">
              Try demo account
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}