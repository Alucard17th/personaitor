<?php

namespace App\Http\Controllers;

use Blogavel\Blogavel\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $posts = Post::query()
            ->with('featuredMedia:id,disk,path')
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->orderByDesc('published_at')
            ->paginate(9)
            ->through(function (Post $post) {
                $decoded = html_entity_decode((string) ($post->content ?? ''), ENT_QUOTES | ENT_HTML5, 'UTF-8');
                $decoded = str_replace("\xC2\xA0", ' ', $decoded);
                $plain = trim(preg_replace('/\s+/u', ' ', strip_tags($decoded)));
                $words = max(1, str_word_count($plain));

                $featuredImageUrl = $post->featuredMedia
                    ? Storage::disk((string) ($post->featuredMedia->disk ?: 'public'))->url((string) $post->featuredMedia->path)
                    : null;

                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => mb_substr($plain, 0, 180),
                    'featured_image_url' => $featuredImageUrl,
                    'reading_time' => max(1, (int) round($words / 220)),
                    'published_at' => $post->published_at,
                ];
            });

        return Inertia::render('blog/index', [
            'seo' => [
                'title' => 'Personaitor Blog — Buyer Persona, ICP & AI Marketing Guides',
                'description' => 'Practical guides on AI buyer personas, ICP definition, JTBD frameworks, paid ad targeting, onboarding copy and SaaS growth — written by the Personaitor team.',
                'keywords' => 'buyer persona blog, ICP guides, AI marketing persona, JTBD framework, SaaS growth, onboarding copy, paid ads targeting',
                'canonical' => url('/blog'),
            ],
            'posts' => $posts,
        ]);
    }

    public function show(Request $request, string $slug)
    {
        $post = Post::query()
            ->with('featuredMedia:id,disk,path')
            ->where('slug', $slug)
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->firstOrFail();

        $featuredImageUrl = $post->featuredMedia
            ? Storage::disk((string) ($post->featuredMedia->disk ?: 'public'))->url((string) $post->featuredMedia->path)
            : null;

        $decoded = html_entity_decode((string) ($post->content ?? ''), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $decoded = str_replace("\xC2\xA0", ' ', $decoded);
        $plain = trim(preg_replace('/\s+/u', ' ', strip_tags($decoded)));
        $description = mb_substr($plain, 0, 160);

        $canonical = url('/blog/'.$post->slug);

        return Inertia::render('blog/show', [
            'seo' => [
                'title' => (string) $post->title.' — Personaitor Blog',
                'description' => $description,
                'canonical' => $canonical,
                'ogImage' => $featuredImageUrl ?: null,
                'article' => [
                    'type' => 'Article',
                    'headline' => (string) $post->title,
                    'description' => $description,
                    'image' => $featuredImageUrl,
                    'datePublished' => optional($post->published_at)->toIso8601String(),
                    'dateModified' => optional($post->updated_at ?? $post->published_at)->toIso8601String(),
                    'url' => $canonical,
                    'wordCount' => str_word_count($plain),
                ],
                'breadcrumbs' => [
                    ['name' => 'Home', 'url' => url('/')],
                    ['name' => 'Blog', 'url' => url('/blog')],
                    ['name' => (string) $post->title, 'url' => $canonical],
                ],
            ],
            'post' => array_merge($post->toArray(), [
                'featured_image_url' => $featuredImageUrl,
            ]),
        ]);
    }
}
