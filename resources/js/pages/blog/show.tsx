import Footer from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';

type BlogPost = {
    id: number;
    title: string;
    slug: string;
    content: string;
    published_at?: string | null;
};

type PageProps = {
    post: BlogPost;
};

export default function BlogShow({ post }: PageProps) {
    return (
        <>
            <Head title={post.title} />
            <Navbar />
            <main className="xs:pt-20 px-6 pt-16 sm:pt-24 md:px-12 lg:px-24">
                <div className="mx-auto max-w-4xl space-y-6">
                    <div>
                        <Link
                            href="/blog"
                            className="text-sm text-muted-foreground underline underline-offset-4"
                        >
                            Back to blog
                        </Link>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl">{post.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <article
                                className="prose prose-slate max-w-none dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </>
    );
}
