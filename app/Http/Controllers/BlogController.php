<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $posts = DB::table('blogavel_posts')
            ->select(['id', 'title', 'slug', 'content', 'published_at'])
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->orderByDesc('published_at')
            ->paginate(10)
            ->through(function ($post) {
                $plain = trim(preg_replace('/\s+/', ' ', strip_tags((string) ($post->content ?? ''))));
                $post->excerpt = mb_substr($plain, 0, 160);
                unset($post->content);
                return $post;
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
        $post = DB::table('blogavel_posts')
            ->select(['id', 'title', 'slug', 'content', 'published_at'])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->first();

        if (! $post) {
            abort(404);
        }

        $plain = trim(preg_replace('/\s+/', ' ', strip_tags((string) ($post->content ?? ''))));
        $description = mb_substr($plain, 0, 160);

        return Inertia::render('blog/show', [
            'seo' => [
                'title' => (string) $post->title,
                'description' => $description,
            ],
            'post' => $post,
        ]);
    }
}
