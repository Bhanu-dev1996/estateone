import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  User, 
  ArrowLeft, 
  ShareNetwork, 
  Check, 
  Copy, 
  LinkedinLogo, 
  TwitterLogo, 
  WhatsappLogo, 
  ShieldCheck, 
  Sparkle,
  ArrowRight,
  ChatCircleText,
  BookmarkSimple
} from '@phosphor-icons/react';
import { SAMPLE_ARTICLES, getRelatedArticles } from '../data/articles';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import { useToast } from '../context/ToastContext';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { toastSuccess } = useToast();
  const [copied, setCopied] = useState(false);

  const article = SAMPLE_ARTICLES.find((a) => a.slug === slug || a.id === slug) || SAMPLE_ARTICLES[0];
  const relatedArticles = getRelatedArticles(article.slug, article.category, 3);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toastSuccess('Link copied to clipboard', 'Article URL is ready to share.');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${article.title} - ${currentUrl}`)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left w-full space-y-12">
      
      {/* =========================================================================
          1. BREADCRUMBS & ARTICLE HEADER
         ========================================================================= */}
      <section className="space-y-4">
        <Breadcrumbs 
          items={[
            { label: 'Blog and property guides', href: '/blog' },
            { label: article.category, href: `/blog?category=${encodeURIComponent(article.category)}` },
            { label: article.title }
          ]} 
          className="mb-2" 
        />

        <div className="space-y-4 max-w-4xl">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-brand-navy text-brand-gold text-xs font-bold tracking-wider uppercase shadow-xs">
              {article.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Clock size={14} className="text-slate-400" />
              <span>{article.readTime}</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Published {article.publishedDate}
            </span>
          </div>

          <h1 className="heading-1 text-brand-navy tracking-tight leading-tight">
            {article.title}
          </h1>

          {/* Author Byline & Social Share Suite */}
          <div className="pt-2 pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-y border-slate-100 flex-wrap">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-12 h-12 rounded-full object-cover shadow-xs"
              />
              <div>
                <span className="caption-1 font-bold text-brand-navy block">
                  {article.author.name}
                </span>
                <span className="caption-3 text-slate-400">
                  {article.author.role}
                </span>
              </div>
            </div>

            {/* Share Suite */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="caption-3 text-slate-400 font-semibold mr-1">Share:</span>
              
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-xs"
                title="Copy article link"
              >
                {copied ? <Check size={14} className="text-emerald-600" weight="bold" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy link'}</span>
              </button>

              <button
                type="button"
                onClick={shareOnWhatsApp}
                aria-label="Share on WhatsApp"
                className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50 text-emerald-600 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              >
                <WhatsappLogo size={16} weight="fill" />
              </button>

              <button
                type="button"
                onClick={shareOnLinkedIn}
                aria-label="Share on LinkedIn"
                className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 text-[#0077b5] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              >
                <LinkedinLogo size={16} weight="fill" />
              </button>

              <button
                type="button"
                onClick={shareOnTwitter}
                aria-label="Share on Twitter"
                className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              >
                <TwitterLogo size={16} weight="fill" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. FEATURED IMAGE BANNER
         ========================================================================= */}
      <div className="rounded-3xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-slate-100 shadow-sm">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* =========================================================================
          3. EDITORIAL CONTENT & SIDEBAR
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left 8 Cols: Main Body Content */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Excerpt Callout */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border-l-4 border-brand-blue body-2 font-medium text-brand-navy leading-relaxed shadow-xs">
            {article.excerpt}
          </div>

          {/* Key Takeaway Callout */}
          {article.keyTakeaway && (
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 leading-relaxed flex items-start gap-3">
              <Sparkle size={20} weight="fill" className="text-brand-gold shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Key regulatory takeaway</span>
                <p className="text-amber-800 leading-relaxed">{article.keyTakeaway}</p>
              </div>
            </div>
          )}

          {/* Structured Article Sections */}
          <div className="space-y-8">
            {article.content.map((sec, idx) => (
              <div key={idx} className="space-y-3">
                <h2 className="title-1 text-brand-navy font-bold tracking-tight">
                  {sec.heading}
                </h2>
                <p className="body-3 text-slate-600 leading-loose">
                  {sec.body}
                </p>
              </div>
            ))}
          </div>

          {/* Author Footnote Box */}
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs flex items-center gap-4">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-16 h-16 rounded-2xl object-cover shrink-0"
            />
            <div className="space-y-1">
              <span className="caption-3 text-slate-400 uppercase tracking-wider block">
                Written by accredited author
              </span>
              <h3 className="caption-1 font-bold text-brand-navy">
                {article.author.name}
              </h3>
              <p className="caption-2 text-slate-500">
                {article.author.role} • EstateOne Editorial Board
              </p>
            </div>
          </div>

          {/* Bottom Share & Back Actions */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
            <Link
              to="/blog"
              className="text-xs font-semibold text-brand-navy hover:text-brand-blue flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={15} />
              <span>Back to all property guides</span>
            </Link>

            <button
              type="button"
              onClick={handleCopyLink}
              className="text-xs font-semibold text-brand-blue hover:underline cursor-pointer flex items-center gap-1"
            >
              <ShareNetwork size={14} />
              <span>Share this guide</span>
            </button>
          </div>

        </div>

        {/* Right 4 Cols: Sticky Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Advisory Desk CTA */}
          <Card className="p-6 rounded-3xl bg-white shadow-xs border-0 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center">
              <ChatCircleText size={20} weight="fill" />
            </div>
            <div>
              <h4 className="title-2 text-brand-navy font-bold">
                Need customized property advice?
              </h4>
              <p className="caption-2 text-slate-500 mt-1 leading-relaxed">
                Connect directly with regional counsel or RERA certified advisors for private portfolio guidance.
              </p>
            </div>
            <Link to="/contact">
              <Button className="w-full py-2.5 rounded-xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold cursor-pointer shadow-xs">
                Request private consultation
              </Button>
            </Link>
          </Card>

          {/* Table of Contents / Guide Landmarks */}
          <Card className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-3">
            <span className="caption-2 font-bold text-brand-navy block">
              In this guide
            </span>
            <ul className="space-y-2 text-xs text-slate-600">
              {article.content.map((sec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-brand-blue">{idx + 1}.</span>
                  <span className="leading-snug">{sec.heading}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Verification Protocol Badge */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-900 text-xs flex items-start gap-2.5">
            <ShieldCheck size={18} weight="fill" className="text-emerald-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-emerald-800">
              Every guide on EstateOne is authored in accordance with state real estate regulatory authority regulations and Indian stamp act provisions.
            </p>
          </div>

        </aside>

      </div>

      {/* =========================================================================
          4. RELATED ARTICLES (PRD 5.12 REQUIREMENT)
         ========================================================================= */}
      {relatedArticles.length > 0 && (
        <section className="pt-12 border-t border-slate-100 space-y-6">
          <div>
            <h3 className="heading-3 text-brand-navy font-bold tracking-tight">
              Related property guides and analyses
            </h3>
            <p className="caption-2 text-slate-500 mt-0.5">
              Continue reading curated insights in {article.category}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <article
                key={rel.id}
                className="group bg-white rounded-3xl overflow-hidden border-0 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={rel.coverImage}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-brand-navy/90 text-white text-[10px] font-bold tracking-wide shadow-xs">
                        {rel.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="caption-3 text-slate-400 block">
                      {rel.readTime} • {rel.publishedDate}
                    </span>
                    <h4 className="title-2 font-bold text-brand-navy group-hover:text-brand-blue transition-colors line-clamp-2">
                      <Link to={`/blog/${rel.slug}`}>
                        {rel.title}
                      </Link>
                    </h4>
                    <p className="caption-2 text-slate-500 line-clamp-2 leading-relaxed">
                      {rel.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-3">
                  <span className="caption-3 text-slate-500 font-semibold truncate max-w-[150px]">
                    {rel.author.name}
                  </span>
                  <Link
                    to={`/blog/${rel.slug}`}
                    className="caption-2 font-semibold text-brand-blue hover:text-brand-navy flex items-center gap-1"
                  >
                    <span>Read</span>
                    <ArrowRight size={12} weight="bold" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
