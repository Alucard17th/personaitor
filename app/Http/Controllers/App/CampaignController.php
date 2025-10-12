<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Persona;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CampaignController extends Controller
{
    public function index()
    {
        $campaigns = Campaign::with('personas')
            ->latest()
            ->paginate(15)
            ->through(fn (Campaign $c) => [
                'id'        => $c->id,
                'name'      => $c->name,
                'start_date'=> $c->start_date?->toIso8601String(),
                'end_date'=> $c->end_date?->toIso8601String(),
                'status'    => $c->status,
                'personas'  => $c->personas
            ])
            ->withQueryString();
        return Inertia::render('app/campaigns/index', compact('campaigns'));
    }

    public function show(Campaign $campaign)
    {
        $campaign->load('personas');
        return Inertia::render('app/campaigns/show', compact('campaign'));
    }

    public function create()
    {
        $personas = Persona::all();
        $mode = 'create';
        return Inertia::render('app/campaigns/create', compact('personas', 'mode'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:campaigns,name',
            'description' => 'nullable|string',
            'status' => 'required|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'personas' => 'nullable|array',
            'personas.*' => 'exists:personas,id',
        ]);

        $campaign = Campaign::create($data);
        if (!empty($data['personas'])) {
            $campaign->personas()->sync($data['personas']);
        }

        return redirect()->route('campaigns.index')->with('success', 'Campaign created successfully.');
    }

    public function edit(Campaign $campaign)
    {
        $personas = Persona::all();
        $campaign->load('personas');
        $mode = 'edit';
        return Inertia::render('app/campaigns/edit', compact('campaign', 'personas', 'mode'));
    }

    public function update(Request $request, Campaign $campaign)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:campaigns,name,' . $campaign->id,
            'description' => 'nullable|string',
            'status' => 'required|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'personas' => 'nullable|array',
            'personas.*' => 'exists:personas,id',
        ]);

        $campaign->update($data);
        $campaign->personas()->sync($data['personas'] ?? []);

        return redirect()->route('campaigns.index')->with('success', 'Campaign updated successfully.');
    }

    public function destroy(Campaign $campaign)
    {
        $campaign->delete();
        return redirect()->route('campaigns.index')->with('success', 'Campaign deleted successfully.');
    }
}
