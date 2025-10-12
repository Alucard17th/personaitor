<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::query()
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('app/categories/index', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        return Inertia::render('app/categories/form', [
            'category' => null,
            'mode' => 'create',
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:120', 'unique:categories,name'],
            'slug'        => ['nullable', 'string', 'max:140', 'unique:categories,slug'],
            'color'       => ['nullable', 'string', 'max:20'],
            'description' => ['nullable', 'string'],
        ]);

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        Category::create($data);

        return to_route('categories.index')->with('status', 'Category created');
    }

    public function edit(Category $category)
    {
        return Inertia::render('app/categories/form', [
            'category' => $category,
            'mode' => 'edit',
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:120', Rule::unique('categories', 'name')->ignore($category->id)],
            'slug'        => ['nullable', 'string', 'max:140', Rule::unique('categories', 'slug')->ignore($category->id)],
            'color'       => ['nullable', 'string', 'max:20'],
            'description' => ['nullable', 'string'],
        ]);

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $category->update($data);

        return to_route('categories.index')->with('status', 'Category updated');
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return back()->with('status', 'Category deleted');
    }
}
