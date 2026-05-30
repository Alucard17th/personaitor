import Footer from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowUpRight,
    CalendarDays,
    ChevronRight,
    Clock,
    Link as LinkIcon,
    Linkedin,
    Twitter,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type BlogPost = {
    id: number;
    title: string;
    slug: string;
    content: string;
    featured_image_url?: string | null;
    published_at?: string | null;
};

type PageProps = {
    post: BlogPost;
};

const stripHtml = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const estimateReadingTime = (html: string) => {
    const words = stripHtml(html).split(' ').filter(Boolean).length;
    return Math.max(1, Math.round(words / 220));
};

type SeoProps = {
    article?: {
        headline?: string;
        description?: string;
        image?: string | null;
        datePublished?: string;
        dateModified?: string;
        url?: string;
        wordCount?: number;
    };
    breadcrumbs?: { name: string; url: string }[];
};

export default function BlogShow({ post }: PageProps) {
    const page = usePage<{ seo?: SeoProps }>();
    const seo = page.props.seo ?? {};

    const articleJsonLd = seo.article
        ? {
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: seo.article.headline ?? post.title,
              description: seo.article.description,
              image: seo.article.image ?? undefined,
              datePublished: seo.article.datePublished,
              dateModified: seo.article.dateModified,
              wordCount: seo.article.wordCount,
              mainEntityOfPage: {
                  '@type': 'WebPage',
                  '@id': seo.article.url,
              },
              author: { '@type': 'Organization', name: 'Personaitor' },
              publisher: {
                  '@type': 'Organization',
                  name: 'Personaitor',
                  logo: {
                      '@type': 'ImageObject',
                      url:
                          typeof window !== 'undefined'
                              ? `${window.location.origin}/favicon.png`
                              : '/favicon.png',
                  },
              },
          }
        : null;

    const breadcrumbJsonLd = seo.breadcrumbs?.length
        ? {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: seo.breadcrumbs.map((b, i) => ({
                  '@type': 'ListItem',
                  position: i + 1,
                  name: b.name,
                  item: b.url,
              })),
          }
        : null;

    const sanitizedContent = useMemo(
        () => (post.content ?? '').replaceAll('&nbsp;', ' ').replaceAll(' ', ' '),
        [post.content],
    );
    const featuredImageUrl = post.featured_image_url ?? null;

    const publishedAtDisplay = post.published_at
        ? new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(new Date(post.published_at))
        : null;
    const publishedAtIso = post.published_at ? new Date(post.published_at).toISOString() : undefined;

    const readingTime = useMemo(() => estimateReadingTime(sanitizedContent), [sanitizedContent]);
    const wordCount = useMemo(() => stripHtml(sanitizedContent).split(' ').filter(Boolean).length, [sanitizedContent]);

    const [progress, setProgress] = useState(0);
    const [shareUrl, setShareUrl] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') setShareUrl(window.location.href);

        const onScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            /* noop */
        }
    };

    const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`;
    const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

    return (
        <>
            <Head title={post.title} />
            {articleJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
                />
            )}
            {breadcrumbJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
                />
            )}
            <Navbar />

            {/* Reading progress bar */}
            <div
                aria-hidden="true"
                className="fixed left-0 top-0 z-50 h-[3px] w-full bg-transparent"
            >
                <div
                    className="h-full bg-primary transition-[width] duration-150 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <main className="pt-24 sm:pt-28">
                {/* ===== HERO ===== */}
                <header className="relative">
                    {featuredImageUrl ? (
                        <div className="relative h-[42vh] min-h-[320px] w-full overflow-hidden sm:h-[52vh]">
                            <img
                                src={featuredImageUrl}
                                alt={post.title}
                                className="h-full w-full object-cover"
                                loading="eager"
                                decoding="async"
                                fetchPriority="high"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-background" />
                            <div className="absolute inset-x-0 bottom-0 mx-auto max-w-4xl px-6 pb-10">
                                <nav
                                    aria-label="Breadcrumb"
                                    className="mb-4 flex items-center gap-1 text-xs text-white/80"
                                >
                                    <Link href="/blog" className="hover:underline">Blog</Link>
                                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                                    <span className="truncate">{post.title}</span>
                                </nav>
                                <Badge variant="secondary" className="rounded-full bg-white/90 text-foreground">
                                    Article
                                </Badge>
                                <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                                    {post.title}
                                </h1>
                                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/85">
                                    {publishedAtDisplay && (
                                        <span className="inline-flex items-center gap-1.5">
                                            <CalendarDays className="h-4 w-4" />
                                            <time dateTime={publishedAtIso}>{publishedAtDisplay}</time>
                                        </span>
                                    )}
                                    <span aria-hidden="true">·</span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        {readingTime} min read
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mx-auto max-w-4xl px-6 pb-2 pt-6">
                            <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
                                <Link href="/blog" className="hover:underline">Blog</Link>
                                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                                <span className="truncate">{post.title}</span>
                            </nav>
                            <Badge variant="secondary" className="rounded-full">Article</Badge>
                            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                                {post.title}
                            </h1>
                            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                {publishedAtDisplay && (
                                    <span className="inline-flex items-center gap-1.5">
                                        <CalendarDays className="h-4 w-4" />
                                        <time dateTime={publishedAtIso}>{publishedAtDisplay}</time>
                                    </span>
                                )}
                                <span aria-hidden="true">·</span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    {readingTime} min read
                                </span>
                            </div>
                        </div>
                    )}
                </header>

                {/* ===== BODY ===== */}
                <section className="mx-auto max-w-6xl px-6 py-10 sm:py-14 md:px-10">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_220px]">
                        {/* Article */}
                        <article
                            className="blog-content prose prose-slate max-w-none min-w-0 break-words
                                prose-p:my-6 prose-p:leading-8 prose-p:text-foreground/90
                                prose-headings:scroll-mt-28 prose-headings:font-semibold prose-headings:tracking-tight
                                prose-h1:mt-0 prose-h1:mb-6 prose-h1:text-3xl
                                prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-2xl
                                prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl
                                prose-h4:mt-6 prose-h4:mb-2 prose-h4:text-lg
                                prose-strong:text-foreground
                                prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                                prose-blockquote:border-l-primary prose-blockquote:text-foreground/80 prose-blockquote:not-italic
                                prose-li:my-1 prose-hr:my-10
                                prose-img:rounded-xl prose-img:shadow-sm
                                prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.9em] prose-code:before:content-[''] prose-code:after:content-['']
                                prose-pre:rounded-xl prose-pre:bg-zinc-950 prose-pre:text-zinc-100
                                sm:prose-lg md:prose-xl dark:prose-invert
                                [&_*]:min-w-0 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap
                                [&_code]:break-words [&_a]:break-words [&_img]:max-w-full"
                            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                        />

                        {/* Sticky sidebar */}
                        <aside className="lg:sticky lg:top-28 lg:self-start">
                            <div className="rounded-2xl border bg-card/60 p-5 backdrop-blur-sm">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Share this article
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Button
                                        asChild
                                        size="sm"
                                        variant="outline"
                                        className="rounded-full"
                                    >
                                        <a href={twitterHref} target="_blank" rel="noreferrer noopener" aria-label="Share on X / Twitter">
                                            <Twitter className="h-4 w-4" />
                                        </a>
                                    </Button>
                                    <Button
                                        asChild
                                        size="sm"
                                        variant="outline"
                                        className="rounded-full"
                                    >
                                        <a href={linkedinHref} target="_blank" rel="noreferrer noopener" aria-label="Share on LinkedIn">
                                            <Linkedin className="h-4 w-4" />
                                        </a>
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="rounded-full"
                                        onClick={handleCopy}
                                        aria-label="Copy link"
                                    >
                                        <LinkIcon className="h-4 w-4" />
                                        <span className="ml-1.5 text-xs">{copied ? 'Copied' : 'Copy'}</span>
                                    </Button>
                                </div>

                                <div className="mt-5 border-t pt-4 text-sm text-muted-foreground">
                                    <div className="flex items-center justify-between">
                                        <span>Reading time</span>
                                        <span className="font-medium text-foreground">{readingTime} min</span>
                                    </div>
                                    {wordCount > 0 && (
                                        <div className="mt-1 flex items-center justify-between">
                                            <span>Word count</span>
                                            <span className="font-medium text-foreground">{wordCount.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Inline CTA */}
                            <div className="mt-5 rounded-2xl border bg-gradient-to-br from-primary/10 to-transparent p-5">
                                <p className="text-sm font-semibold">Try Personaitor free</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Generate a buyer persona from a single prompt in under 60 seconds.
                                </p>
                                <Link href="/register" className="mt-3 inline-block">
                                    <Button size="sm" className="rounded-full">
                                        Start free
                                        <ArrowUpRight className="ml-1.5 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </aside>
                    </div>

                    {/* Footer nav */}
                    <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t pt-8 sm:flex-row sm:items-center">
                        <Link href="/blog">
                            <Button variant="ghost" className="rounded-full">
                                <ArrowLeft className="mr-1.5 h-4 w-4" />
                                Back to blog
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button className="rounded-full">
                                Generate your free persona
                                <ArrowUpRight className="ml-1.5 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
