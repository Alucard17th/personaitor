<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use App\Models\Persona;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PersonaController extends Controller
{
    /**
     * Display a listing of the resource (Inertia).
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $personas = $user->personas()
            ->latest()
            ->paginate(12)
            ->through(fn (Persona $p) => [
                'id'        => $p->id,
                'name'      => $p->name,
                'favorite'  => (bool) $p->favorite,
                'created_at'=> $p->created_at?->toIso8601String(),
            ]);

        $favorite_personas = $user->personas()
            ->where('favorite', 1)
            ->latest()
            ->take(10)
            ->get(['id','name','favorite']);

        $products = Product::query()
            ->latest()
            ->take(20)
            ->get(['id','name']);

        return Inertia::render('app/personas/index', [
            'personas'           => $personas,
            'favorite_personas'  => $favorite_personas,
            'products'           => $products,
        ]);
    }

    /**
     * Show the form for creating a new resource (Inertia).
     * (You can create the TSX at resources/js/Pages/app/personas/create.tsx later.)
     */
    public function create(): Response
    {
        $categories = \App\Models\Category::orderBy('name')->get(['id','name','color']);
        return Inertia::render('app/personas/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Generate resource based on AI prompt guidance (JSON API).
     * Kept as JSON because the frontend likely calls it via XHR.
     * Move your API keys to env()!
     */
    public function generate(Request $request)
    {
        // if (!$request->user()->canGenerate()) {
        //     return back()->with('error', 'Insufficient credits.');
        // }

        $payload = json_decode($request->input('data') ?? '{}', true);
        $prompt  = $payload['prompt'] ?? null;
        $level   = $payload['level'] ?? 'normal';
        $additionalCriteria = $payload['additionalCriteria'] ?? [];

        if (!$prompt) {
            return back()->with('error', 'Prompt is required.');
        }

        $formattedString = json_encode(array_combine($additionalCriteria, $additionalCriteria), JSON_PRETTY_PRINT);

        $normal = rtrim('{
            "name": "Full Name",
            "age": Age,
            "gender": "Gender",
            "occupation": "Occupation",
            "location": "City, Country",
            "interests": ["Interest1", "Interest2", "Interest3"],
            "bio": "A brief biography of the user.",
            "goals": ["Goal1", "Goal2"],
            "challenges": ["Challenge1", "Challenge2"]
        }', '}') . ",\n" . trim($formattedString, "{}") . "\n}";

        $advanced = rtrim('{
            "name": "Full Name",
            "age": Age,
            "gender": "Gender",
            "occupation": "Occupation",
            "location": "City, Country",
            "marital_status": "Single/Married/etc.",
            "education_level": "Highest Level of Education",
            "income_level": "Income Range",
            "interests": ["Interest1", "Interest2", "Interest3"],
            "bio": "A brief biography of the user.",
            "goals": ["Goal1", "Goal2"],
            "challenges": ["Challenge1", "Challenge2"],
            "preferred_communication_channels": ["Email", "Phone", "Social Media", "In-Person"],
            "technology_usage": {
                "devices": ["Device1", "Device2"],
                "proficiency": "Low/Medium/High",
                "favorite_apps": ["App1", "App2", "App3"]
            },
            "buying_behavior": {
                "decision_factors": ["Factor1", "Factor2"],
                "preferred_payment_methods": ["Credit Card", "PayPal", "Bank Transfer"]
            },
            "motivation": ["Motivation1", "Motivation2"],
            "frustrations": ["Frustration1", "Frustration2"],
            "social_media_usage": {
                "platforms": ["Platform1", "Platform2"],
                "frequency": "Daily/Weekly/etc."
            },
            "brand_affinity": ["Brand1", "Brand2"],
            "quote": "A relevant quote or saying that captures the persona\'s attitude or outlook."
        }', '}') . ",\n" . trim($formattedString, "{}") . "\n}";

        $chosenLevel = $level !== 'normal' ? $advanced : $normal;

        $formattedPrompt = 'You are an AI specialized in generating precise and structured user personas in JSON format only. Your response must be strictly in JSON format without any additional text, explanations, or comments. 
        User personas should include the following fields: ' . $chosenLevel . ' 
        Based on the input below, generate a detailed and accurate user persona: 
        ' . $prompt;

        // --- Groq
        $groqKey = env('GROQ_API_KEY');
        if (!$groqKey) return back()->with('error', 'Missing GROQ_API_KEY');

        $data = [
            "messages" => [
                ["role" => "user", "content" => $formattedPrompt]
            ],
            "model" => "llama-3.1-8b-instant"
        ];

        try {
            $ch = curl_init();
            curl_setopt_array($ch, [
                CURLOPT_URL => 'https://api.groq.com/openai/v1/chat/completions',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => json_encode($data),
                CURLOPT_HTTPHEADER => [
                    'Authorization: Bearer ' . $groqKey,
                    'Content-Type: application/json',
                ],
            ]);

            $groqResponse = curl_exec($ch);
            $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlErr = $groqResponse === false ? curl_error($ch) : null;
            curl_close($ch);
            if ($groqResponse === false) {
                return back()->with('error', 'Groq cURL error: '.$curlErr);
            }
            if ((int)$http !== 200) {
                // Try to surface API error details
                $err = json_decode($groqResponse, true);
                $msg = $err['error']['message'] ?? 'Groq HTTP '.$http;
                return back()->with('error', $msg);
            }

            $jsonResponse   = json_decode($groqResponse, true);
            $personaMessage = $jsonResponse['choices'][0]['message'] ?? null;
            \Log::info('JSON Response: ' . json_encode($jsonResponse, JSON_PRETTY_PRINT));
            
        } catch (\Throwable $e) {
            return back()->with('error', 'Groq exception: ' . $e->getMessage());
        }

        // --- HF image
        $hfKey = env('HUGGINGFACE_API_KEY');
        if (!$hfKey) return back()->with('error', 'Missing HUGGINGFACE_API_KEY');

        try {
            $ch2 = curl_init();
            curl_setopt_array($ch2, [
                CURLOPT_URL => 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => '{"inputs": "A user avatar for the following description: '.addslashes($prompt).'"}',
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/json',
                    'Authorization: Bearer ' . $hfKey,
                ],
            ]);

            $imgResponse = curl_exec($ch2);
            if ($imgResponse === false) {
                $err = curl_error($ch2);
                curl_close($ch2);
                return back()->with('error', 'HF error: ' . $err);
            }
            $code = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
            curl_close($ch2);

            \Log::info('HF Response: ' . $imgResponse);

            if ((int)$code !== 200) {
                // return back()->with('error', 'Failed to generate avatar');
            }

            $imageData = 'data:image/png;base64,' . base64_encode($imgResponse);
            // TO DELETE LATER
            $imageData = 'https://i.pravatar.cc/700?img=5';

            // decrement credit if you want
            $request->user()->decreaseQuantity(1);

            return back()
                ->with('status', 'Persona generated')
                ->with('generated', [
                    'persona' => $personaMessage, // { role, content }
                    'image'   => $imageData,
                ]);
        } catch (\Throwable $e) {
            return back()->with('error', 'HF exception: ' . $e->getMessage());
        }
    }

    /**
     * Store a newly created resource in storage (JSON API or redirect).
     * Keep JSON for now to avoid breaking existing frontend.
     */
    public function store(Request $request)
    {
       
        $payload = $request->validate([
            'data'         => ['required'],
            'settings'     => ['required'],
            'prompt'       => ['nullable'],
            'category_ids' => ['array'],
            'category_ids.*' => ['integer', 'exists:categories,id'],
        ]);

        $personaData     = json_decode($payload['data'] ?? '[]', true);
        $personaSettings = json_decode($payload['settings'] ?? '{}', true);

        $persona = new \App\Models\Persona();
        $persona->data     = $personaData;
        $persona->prompt   = $payload['prompt'] ?? null;
        $persona->image    = '/persona/path/image.jpg';
        $persona->settings = $personaSettings;
        $persona->user_id  = $request->user()->id;
        $persona->name     = $personaSettings['name'] ?? ('Persona_' . ($request->user()->personas()->count() + 1));
        $persona->save();

        if (!empty($payload['category_ids'])) {
            $persona->categories()->sync($payload['category_ids']);
        }

        return to_route('personas.edit', $persona)->with('status', 'Persona created');

        // return back()->with([
        //     'status' => 'Persona created',
        //     'saved_persona' => [
        //         'id'   => $persona->id,
        //         'name' => $persona->name,
        //     ],
        // ]);
    }

    /**
     * Display a persona (JSON or Inertia as needed).
     */
    public function show(Request $request, Persona $persona)
    {
        abort_if($persona->user_id !== $request->user()->id, 403);
        // For Inertia page: return Inertia::render('app/personas/show', ['persona' => $persona]);
        return response()->json($persona);
    }

    /**
     * Show the edit form (Inertia).
     */
    public function edit(Request $request, Persona $persona): Response
    {
        abort_if($persona->user_id !== $request->user()->id, 403);
        $categories = \App\Models\Category::orderBy('name')->get(['id','name','color']);
        $persona->load('categories:id,name'); // so front-end can preselect
        return Inertia::render('app/personas/edit', [
            'persona' => [
                'id'       => $persona->id,
                'name'     => $persona->name,
                'favorite' => (bool) $persona->favorite,
                'data'     => $persona->data,
                'settings' => $persona->settings,
                'image'    => $persona->image,
                'prompt'   => $persona->prompt,
                'categories' => $persona->categories->map->only(['id','name']),
            ],
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage (JSON API).
     */
    public function update(Request $request, Persona $persona)
    {
        abort_if($persona->user_id !== $request->user()->id, 403);

        $data = $request->all();
        $persona->name     = $data['data']['settings']['name'] ?? $persona->name;
        $persona->data     = $data['data']['data'];
        $persona->image    = '/persona/path/image.jpg';
        $persona->settings = $data['data']['settings'];
        $persona->user_id  = $request->user()->id;
        $persona->save();

        $persona->categories()->sync($data['data']['category_ids'] ?? []);

        return back()->with([
            'status' => 'Persona updated successfully',
            'saved_persona' => [
                'id'   => $persona->id,
                'name' => $persona->name,
            ],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Persona $persona)
    {
        abort_if($persona->user_id !== $request->user()->id, 403);
        $persona->delete();

        return to_route('personas.index')->with('status', 'Persona deleted');
    }

    public function exportCsv(Request $request, $id)
    {
        $persona = Persona::where('user_id', $request->user()->id)->findOrFail($id);
        $items = json_decode($persona->data, true) ?: [];

        $csvHeader = ['Field', 'Value'];
        $csvData = [];
        foreach ($items as $item) {
            preg_match('/<div[^>]*class="grid-title"[^>]*>(.*?)<\/div>/', $item['content'] ?? '', $title);
            preg_match('/<div[^>]*class="grid-content-desc mt-2"[^>]*>(.*?)<\/div>/', $item['content'] ?? '', $value);
            preg_match('/<img[^>]+src=["\'](data:image\/[^"\']+)["\']/', $item['content'] ?? '', $image);
            $valueContent = $image[1] ?? strip_tags($value[1] ?? '');
            $csvData[] = ['field' => $title[1] ?? 'Unknown', 'value' => $valueContent];
        }

        $handle = fopen('php://temp', 'r+');
        fputcsv($handle, $csvHeader);
        foreach ($csvData as $row) {
            fputcsv($handle, $row);
        }
        rewind($handle);
        $csvOutput = stream_get_contents($handle);
        fclose($handle);

        return response($csvOutput, 200, [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename="persona_'.$persona->id.'.csv"',
        ]);
    }

    public function exportJson(Request $request, $id)
    {
        $persona = Persona::where('user_id', $request->user()->id)->findOrFail($id);
        $items = json_decode($persona->data, true) ?: [];

        $jsonData = [];
        foreach ($items as $item) {
            preg_match('/<div[^>]*class="grid-title"[^>]*>(.*?)<\/div>/', $item['content'] ?? '', $title);
            preg_match('/<div[^>]*class="grid-content-desc mt-2"[^>]*>(.*?)<\/div>/', $item['content'] ?? '', $value);
            preg_match('/<img[^>]+src=["\'](data:image\/[^"\']+)["\']/', $item['content'] ?? '', $image);
            $valueContent = $image[1] ?? strip_tags($value[1] ?? '');
            $jsonData[] = ['field' => $title[1] ?? 'Unknown', 'value' => $valueContent];
        }

        return response()->json($jsonData, 200, [
            'Content-Disposition' => 'attachment; filename=persona_'.$persona->id.'.json',
        ]);
    }


    public function indexFavorites(Request $request)
    {
        $user = $request->user();

        // Only favorites
        $paginator = $user->personas()
            ->where('favorite', true)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        // Shape data for the table
        $personas = [
            'data'  => $paginator->getCollection()->transform(function ($p) {
                return [
                    'id'         => (string) $p->id,
                    'name'       => $p->name,
                    'favorite'   => (bool) $p->favorite,
                    'created_at' => optional($p->created_at)->toISOString(),
                ];
            })->all(),
            'links' => $paginator->linkCollection()->toArray(),
            'total' => $paginator->total(),
        ];

        // Quick “chips” at the top (also favorites)
        $favorite_personas = $user->personas()
            ->where('favorite', true)
            ->orderBy('name')
            ->get(['id', 'name', 'favorite'])
            ->map(fn ($p) => [
                'id'       => (string) $p->id,
                'name'     => $p->name,
                'favorite' => (bool) $p->favorite,
            ]);

        return Inertia::render('app/favorites/index', [
            'personas'          => $personas,
            'favorite_personas' => $favorite_personas,
        ]);
    }

    public function toggleFavorite(Request $request, $id)
    {
        $persona = Persona::where('user_id', $request->user()->id)->findOrFail($id);
        $persona->favorite = ! (bool) $persona->favorite;
        $persona->save();

        // for Inertia index page, redirect back with toast:
        return back()->with('status', $persona->favorite ? 'Added to favorites' : 'Removed from favorites');
    }

    /**
     * Compare page (Inertia skeleton).
     */
    public function compare(Request $request): Response
    {
        $personas = Persona::where('user_id', $request->user()->id)
            ->select('id', 'name')
            ->latest()
            ->get();

        return Inertia::render('app/personas/compare', [
            'personas' => $personas,
        ]);
    }
}
