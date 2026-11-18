import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Clock, User, ArrowLeft, ShareNetwork } from '@phosphor-icons/react';
import { SAMPLE_ARTICLES } from '../data/articles';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const article = SAMPLE_ARTICLES.find((a) => a.slug === slug || a.id === slug) || SAMPLE_ARTICLES[0];

  return (
    <div className="pt-28 pb-20 px-4 max-w-4xl mx-auto text-left">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-brand-muted flex items-center gap-2">
        <Link to="/" className="hover:text-brand-navy">Home</Link>
        <span>/</span>
        <Link to="/blog" className="hover:text-brand-navy">Guides</Link>
        <span>/</span>
        <span className="font-semibold text-brand-navy truncate max-w-xs">{article.title}</span>
      </nav>

      <div className="mb-6">
        <Badge variant="default" className="mb-3">
          <span>{article.category}</span>
        </Badge>
        <h1 className="heading-1 text-brand-navy tracking-tight mb-4">
          {article.title}
        </h1>
        <div className="flex items-center gap-4 text-xs text-brand-muted">
          <span className="flex items-center gap-1.5 font-medium text-brand-navy">
            <User size={16} />
            <span>{article.author}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock size={16} />
            <span>{article.readTime}</span>
          </span>
          <span>•</span>
          <span>{article.publishedDate}</span>
        </div>
      </div>

      <div className="rounded-3xl overflow-hidden aspect-[16/9] mb-10 bg-slate-100 shadow-xs">
        <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
      </div>

      <div className="prose max-w-none text-brand-navy body-2 leading-relaxed space-y-6">
        <p className="text-lg font-medium text-slate-800 leading-relaxed">
          {article.excerpt}
        </p>
        <div className="whitespace-pre-line text-brand-muted leading-loose">
          {article.content}
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-black/5 flex items-center justify-between">
        <Link to="/blog" className="text-xs font-semibold text-brand-navy flex items-center gap-1.5 hover:text-brand-blue">
          <ArrowLeft size={16} />
          <span>Back to all guides</span>
        </Link>
      </div>
    </div>
  );
}
