import Footer from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';

type BlogPost = {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
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

export default function BlogIndex({ posts }: PageProps) {
    return (
        <>
            <Head title="Blog" />
            <Navbar />
            <main className="xs:pt-20 px-6 pt-16 sm:pt-24 md:px-12 lg:px-24">
                <div className="mx-auto max-w-4xl space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">Blog</h1>
                        <p className="text-sm text-muted-foreground">
                            Latest articles, guides, and updates.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {posts.data.length === 0 ? (
                            <Card>
                                <CardContent className="p-6 text-sm text-muted-foreground">
                                    No posts yet.
                                </CardContent>
                            </Card>
                        ) : (
                            posts.data.map((post) => (
                                <Card key={post.id} className="overflow-hidden">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xl">
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="hover:underline"
                                            >
                                                {post.title}
                                            </Link>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {post.excerpt ? (
                                            <p className="text-sm text-muted-foreground">
                                                {post.excerpt}
                                            </p>
                                        ) : null}

                                        <div>
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="text-sm font-medium underline underline-offset-4"
                                            >
                                                Read article
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {posts.links?.length ? (
                        <nav className="flex flex-wrap gap-2 pt-2">
                            {posts.links.map((l) => (
                                <Link
                                    key={l.label}
                                    href={l.url ?? ''}
                                    preserveScroll
                                    className={`rounded border px-3 py-1 text-sm ${
                                        l.active
                                            ? 'bg-foreground text-background'
                                            : 'bg-background text-foreground'
                                    } ${!l.url ? 'pointer-events-none opacity-50' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: l.label }}
                                />
                            ))}
                        </nav>
                    ) : null}
                </div>
            </main>
            <Footer />
        </>
    );
}
