import Footer from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';

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

export default function BlogShow({ post }: PageProps) {
    const sanitizedContent = (post.content ?? '').replaceAll('&nbsp;', ' ').replaceAll('\u00A0', ' ');
    const featuredImageUrl = post.featured_image_url ?? null;

    const publishedAt = post.published_at
        ? new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(new Date(post.published_at))
        : null;

    return (
        <>
            <Head title={post.title} />
            <Navbar />
            <main className="xs:pt-20 px-6 pt-16 sm:pt-24 md:px-12 lg:px-24">
                <div className="mx-auto max-w-6xl space-y-8">
                    <div>
                        <Link
                            href="/blog"
                            className="text-sm text-muted-foreground underline underline-offset-4"
                        >
                            Back to blog
                        </Link>
                    </div>

                    <Card>
                        <CardHeader className="space-y-5">
                            <div className="space-y-2">
                                <CardTitle className="text-3xl leading-tight sm:text-4xl">{post.title}</CardTitle>
                                {publishedAt ? (
                                    <p className="text-sm text-muted-foreground">{publishedAt}</p>
                                ) : null}
                            </div>

                            {featuredImageUrl ? (
                                <div className="overflow-hidden rounded-xl border bg-muted/10 shadow-sm">
                                    <div className="relative aspect-[16/9] w-full">
                                        <img
                                            src={featuredImageUrl}
                                            alt={post.title}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            ) : null}
                        </CardHeader>
                        <CardContent className="p-6 sm:p-8 md:p-10">
                            <div className="mx-auto max-w-4xl">
                                <article
                                    className="blog-content prose prose-slate max-w-none min-w-0 break-words prose-p:my-6 prose-p:leading-8 prose-p:text-foreground/90 prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:tracking-tight prose-h1:mt-0 prose-h1:mb-6 prose-h1:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl prose-h4:mt-6 prose-h4:mb-2 prose-h4:text-lg prose-strong:text-foreground prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-primary prose-blockquote:text-foreground/80 prose-li:my-1 prose-hr:my-10 prose-img:rounded-lg prose-img:shadow-sm sm:prose-lg md:prose-xl dark:prose-invert [&_*]:min-w-0 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_code]:break-words [&_a]:break-words [&_img]:max-w-full"
                                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </>
    );
}
