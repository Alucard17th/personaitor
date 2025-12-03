<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        $sub  = $user->subscription(); // default subscription (Paddle Billing)

        $lastPayment = $sub?->lastPayment();  // may be null until webhooks sync
        $nextPayment = $sub?->nextPayment();  // null when billing cycle ended
        // (Both are Laravel\Paddle\Payment)  // shows amount()/date() helpers
        // Docs: lastPayment/nextPayment usage :contentReference[oaicite:5]{index=5}

        // Build a light plan/status object without calling external Paddle APIs
        $status = $sub ? (
            $sub->paused() ? 'paused' :
            ($sub->onGracePeriod() ? 'canceling' :
            ($sub->pastDue() ? 'past_due' : 'active'))
        ) : 'none'; // pastDue/paused/onGracePeriod documented :contentReference[oaicite:6]{index=6}

        $plan = $sub ? [
            'type'          => $sub->type,                  // your logical subscription "type" if used
            'status'        => $status,
            'trial_ends_at' => optional($sub->trial_ends_at)?->toDateString(),
            'ends_at'       => optional($sub->ends_at)?->toDateString(),    // set when cancel() scheduled
            'paused_at'     => optional($sub->paused_at)?->toDateString(),  // set when paused
            'quantity'      => $sub->quantity,
        ] : null;

        // Recent transactions (completed only) with easy invoice links
        // Docs: transactions & redirectToInvoicePdf :contentReference[oaicite:7]{index=7}
        $transactions = $user->transactions
            ->sortByDesc('billed_at')
            ->take(12)
            ->values()
            ->map(fn ($t) => [
                'id'       => $t->id,
                'date'     => $t->billed_at?->toDateString(),
                'total'    => $t->total(),   // string with currency
                'tax'      => $t->tax(),     // string with currency
                'pdf_url'  => route('billing.invoice.pdf', $t->id),
            ]);

        return Inertia::render('settings/subscription', [
            'plan'        => $plan,
            'lastPayment' => $lastPayment ? [
                'amount' => (string) $lastPayment->amount(),
                'date'   => $lastPayment->date()?->toDateString(),
            ] : null,
            'nextPayment' => $nextPayment ? [
                'amount' => (string) $nextPayment->amount(),
                'date'   => $nextPayment->date()?->toDateString(),
            ] : null,
            'transactions' => $transactions,
        ]);
    }

    // --- Actions ---
    public function cancel(Request $request)
    {
        $request->user()->subscription()?->cancel(); // cancel at period end
        return back()->with('success', 'Subscription will cancel at the end of the period.');
    }

    public function cancelNow(Request $request)
    {
        $request->user()->subscription()?->cancelNow(); // immediate cancel
        return back()->with('success', 'Subscription canceled immediately.');
    }

    public function stopCancelation(Request $request)
    {
        $request->user()->subscription()?->stopCancelation(); // undo scheduled cancel
        return back()->with('success', 'Cancelation stopped.');
    }

    public function pause(Request $request)
    {
        $request->user()->subscription()?->pause(); // pauses at next billing by default
        return back()->with('success', 'Subscription will be paused.');
    }

    public function resume(Request $request)
    {
        $request->user()->subscription()?->resume(); // resume a paused subscription
        return back()->with('success', 'Subscription resumed.');
    }

    public function updatePaymentMethod(Request $request)
    {
        // Redirects the user to Paddle’s hosted update payment method page
        return $request->user()->subscription()->redirectToUpdatePaymentMethod();
        // Docs: redirectToUpdatePaymentMethod :contentReference[oaicite:8]{index=8}
    }
}
