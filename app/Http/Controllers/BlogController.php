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
            ->select(['id', 'title', 'slug', 'content', 'published_at'])
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->orderByDesc('published_at')
            ->paginate(10)
            ->through(function (Post $post) {
                $decoded = html_entity_decode((string) ($post->content ?? ''), ENT_QUOTES | ENT_HTML5, 'UTF-8');
                $decoded = str_replace("\xC2\xA0", ' ', $decoded);
                $plain = trim(preg_replace('/\s+/u', ' ', strip_tags($decoded)));

                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => mb_substr($plain, 0, 160),
                    'published_at' => $post->published_at,
                ];
            });

        return Inertia::render('blog/index', [
            'seo' => [
                'title' => 'Blog',
                'description' => 'Latest articles, guides, and updates from Personaitor.',
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

        return Inertia::render('blog/show', [
            'seo' => [
                'title' => (string) $post->title,
                'description' => $description,
            ],
            'post' => array_merge($post->toArray(), [
                'featured_image_url' => $featuredImageUrl,
            ]),
        ]);
    }
}
