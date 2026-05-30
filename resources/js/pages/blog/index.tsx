import Footer from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, CalendarDays, Clock, Rss, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

type BlogPost = {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    featured_image_url?: string | null;
    reading_time?: number;
    published_at?: string | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Paginated<T> = {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
};

type PageProps = {
    posts: Paginated<BlogPost>;
};

const formatDate = (iso?: string | null) =>
    iso
        ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(
              new Date(iso),
          )
        : '';

const PostCardImage = ({
    src,
    alt,
    eager,
}: {
    src?: string | null;
    alt: string;
    eager?: boolean;
}) => {
    if (src) {
        return (
            <img
                src={src}
                alt={alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading={eager ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={eager ? 'high' : 'auto'}
            />
        );
    }
    return (
        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/15 via-primary/5 to-background text-primary/40">
            <span className="text-5xl font-bold tracking-tight">
                {alt.slice(0, 1).toUpperCase()}
            </span>
        </div>
    );
};

export default function BlogIndex({ posts }: PageProps) {
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        if (!query.trim()) return posts.data;
        const q = query.toLowerCase();
        return posts.data.filter(
            (p) =>
                p.title.toLowerCase().includes(q) ||
                (p.excerpt ?? '').toLowerCase().includes(q),
        );
    }, [posts.data, query]);

    const [featured, ...rest] = filtered;

    const blogJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Personaitor Blog',
        description:
            'Practical guides on AI buyer personas, ICP, JTBD, paid-ad targeting, onboarding copy and SaaS growth.',
        blogPost: posts.data.map((p) => ({
            '@type': 'BlogPosting',
            headline: p.title,
            url:
                typeof window !== 'undefined'
                    ? `${window.location.origin}/blog/${p.slug}`
                    : `/blog/${p.slug}`,
            datePublished: p.published_at ?? undefined,
            image: p.featured_image_url ?? undefined,
            description: p.excerpt ?? undefined,
        })),
    };

    return (
        <>
            <Head>
                <link rel="alternate" type="application/rss+xml" title="Personaitor Blog RSS" href="/blog/feed" />
            </Head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
            />

            <Navbar />

            <main className="pt-24 sm:pt-28">
                {/* ===== Header ===== */}
                <header className="mx-auto max-w-6xl px-6 pb-10">
                    <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <Badge variant="secondary" className="rounded-full">
                                Personaitor Blog
                            </Badge>
                            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                                Buyer persona, ICP &amp; AI marketing playbooks
                            </h1>
                            <p className="mt-3 max-w-[68ch] text-muted-foreground">
                                Actionable guides on AI-generated buyer personas, ICP definition,
                                JTBD frameworks, paid-ad targeting, onboarding copy, landing page
                                conversion, and SaaS growth — written by the Personaitor team.
                            </p>
                        </div>

                        <div className="flex w-full max-w-sm items-center gap-2 rounded-full border bg-background px-3 py-2 shadow-sm">
                            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                            <input
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search articles…"
                                aria-label="Search articles"
                                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>
                </header>

                {/* ===== Grid ===== */}
                <section
                    aria-label="Latest articles"
                    className="mx-auto max-w-6xl px-6 pb-16"
                >
                    {filtered.length === 0 ? (
                        <Card>
                            <CardContent className="p-10 text-center text-muted-foreground">
                                <p className="text-base font-medium text-foreground">
                                    No articles found
                                </p>
                                <p className="mt-1 text-sm">
                                    Try a different search term, or browse all posts.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-8">
                            {/* Featured post */}
                            {featured && (
                                <article className="group">
                                    <Link
                                        href={`/blog/${featured.slug}`}
                                        className="grid overflow-hidden rounded-3xl border bg-card transition hover:shadow-lg md:grid-cols-2"
                                        aria-label={`Read article: ${featured.title}`}
                                    >
                                        <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-auto">
                                            <PostCardImage
                                                src={featured.featured_image_url}
                                                alt={featured.title}
                                                eager
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
                                            <Badge className="w-fit rounded-full">
                                                Featured
                                            </Badge>
                                            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                                {featured.title}
                                            </h2>
                                            {featured.excerpt && (
                                                <p className="text-muted-foreground">
                                                    {featured.excerpt}…
                                                </p>
                                            )}
                                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                                {featured.published_at && (
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <CalendarDays className="h-3.5 w-3.5" />
                                                        <time dateTime={featured.published_at}>
                                                            {formatDate(featured.published_at)}
                                                        </time>
                                                    </span>
                                                )}
                                                {!!featured.reading_time && (
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        {featured.reading_time} min read
                                                    </span>
                                                )}
                                            </div>
                                            <span className="inline-flex w-fit items-center gap-1 text-sm font-medium text-primary">
                                                Read article
                                                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                            </span>
                                        </div>
                                    </Link>
                                </article>
                            )}

                            {/* Rest of grid */}
                            {rest.length > 0 && (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {rest.map((post) => (
                                        <article key={post.id} className="group h-full">
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition hover:shadow-md"
                                                aria-label={`Read article: ${post.title}`}
                                            >
                                                <div className="relative aspect-[16/10] w-full overflow-hidden">
                                                    <PostCardImage
                                                        src={post.featured_image_url}
                                                        alt={post.title}
                                                    />
                                                </div>
                                                <div className="flex flex-1 flex-col gap-3 p-5">
                                                    <h3 className="line-clamp-2 text-lg font-semibold tracking-tight">
                                                        {post.title}
                                                    </h3>
                                                    {post.excerpt && (
                                                        <p className="line-clamp-3 text-sm text-muted-foreground">
                                                            {post.excerpt}…
                                                        </p>
                                                    )}
                                                    <div className="mt-auto flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                                        {post.published_at && (
                                                            <span className="inline-flex items-center gap-1.5">
                                                                <CalendarDays className="h-3.5 w-3.5" />
                                                                <time dateTime={post.published_at}>
                                                                    {formatDate(post.published_at)}
                                                                </time>
                                                            </span>
                                                        )}
                                                        {!!post.reading_time && (
                                                            <span className="inline-flex items-center gap-1.5">
                                                                <Clock className="h-3.5 w-3.5" />
                                                                {post.reading_time} min
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {posts.links?.length ? (
                        <nav
                            aria-label="Pagination"
                            className="mt-12 flex flex-wrap items-center justify-center gap-2"
                        >
                            {posts.links.map((l) => (
                                <Link
                                    key={l.label}
                                    href={l.url ?? ''}
                                    preserveScroll
                                    rel={
                                        l.label.toLowerCase().includes('next')
                                            ? 'next'
                                            : l.label.toLowerCase().includes('prev')
                                              ? 'prev'
                                              : undefined
                                    }
                                    className={`min-w-9 rounded-full border px-3 py-1.5 text-sm transition ${
                                        l.active
                                            ? 'bg-foreground text-background'
                                            : 'bg-background hover:bg-muted'
                                    } ${!l.url ? 'pointer-events-none opacity-50' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: l.label }}
                                />
                            ))}
                        </nav>
                    ) : null}
                </section>

                {/* ===== Subscribe / CTA strip ===== */}
                <section className="mx-auto mb-16 max-w-6xl px-6">
                    <div className="flex flex-col items-start gap-4 rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-background p-8 md:flex-row md:items-center md:justify-between md:p-10">
                        <div className="max-w-xl">
                            <h2 className="text-2xl font-semibold tracking-tight">
                                Turn what you just read into a working buyer persona
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Generate a complete persona — pains, JTBD, triggers, objections
                                and ad angles — from a one-line idea in under 60 seconds.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link href="/register">
                                <Button className="rounded-full" size="lg">
                                    Start free
                                    <ArrowUpRight className="ml-1.5 h-4 w-4" />
                                </Button>
                            </Link>
                            <a
                                href="/blog/feed"
                                className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
                            >
                                <Rss className="h-4 w-4" /> RSS feed
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
