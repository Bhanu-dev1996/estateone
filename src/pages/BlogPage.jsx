import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, User, ArrowRight } from '@phosphor-icons/react';
import { SAMPLE_ARTICLES } from '../data/articles';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export default function BlogPage() {
  const [selectedCat, setSelectedCat] = useState('All');

  const categories = ['All', 'Legal and RERA', 'Buying guides', 'Market insights', 'City guides'];

  const filteredArticles = SAMPLE_ARTICLES.filter(
    (a) => selectedCat === 'All' || a.category === selectedCat
  );

  return (
    <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto text-left">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-brand-muted flex items-center gap-2">
        <Link to="/" className="hover:text-brand-navy">Home</Link>
        <span>/</span>
        <span className="font-semibold text-brand-navy">Property guides</span>
      </nav>

      <div className="mb-8">
        <Badge variant="default" className="mb-3">
          <BookOpen size={16} weight="fill" className="text-brand-blue" />
          <span>Real estate guides and insights</span>
        </Badge>
        <h1 className="heading-1 text-brand-navy tracking-tight">
          EstateOne knowledge hub
        </h1>
        <p className="body-4 text-brand-muted mt-2 max-w-2xl">
          Actionable guides on RERA legal rights, home loan calculations, infrastructure corridors, and Indian property markets.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all ${
              selectedCat === cat
                ? 'bg-brand-navy text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-brand-navy border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Article Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="overflow-hidden rounded-3xl bg-white/70 backdrop-blur-md border-0 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-brand-muted mb-3">
                  <Badge variant="outline" className="text-brand-blue border-brand-blue/30 text-[11px]">
                    {article.category}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{article.readTime}</span>
                  </span>
                  <span>•</span>
                  <span>{article.publishedDate}</span>
                </div>
                <h2 className="title-1 text-brand-navy font-bold mb-3 hover:text-brand-blue transition-colors">
                  <Link to={`/blog/${article.slug}`}>{article.title}</Link>
                </h2>
                <p className="body-4 text-brand-muted line-clamp-3">
                  {article.excerpt}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-black/5 flex items-center justify-between mt-4">
              <span className="caption-2 text-brand-muted flex items-center gap-1.5">
                <User size={14} />
                <span>{article.author}</span>
              </span>
              <Link
                to={`/blog/${article.slug}`}
                className="text-xs font-semibold text-brand-blue hover:text-brand-navy flex items-center gap-1"
              >
                <span>Read article</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
