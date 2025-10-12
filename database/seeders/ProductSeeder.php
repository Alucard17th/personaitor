<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $products = [
            [
                'name'            => 'Starter Plan',
                'features'        => ['1 project', 'Basic analytics', 'Email support'],
                'description'     => 'Ideal for freelancers or first-time builders launching a single project. Get essential features, simple insights, and responsive email support to get off the ground fast.',
                'paddle_price_id' => 'pri_01j36w75011n0hzwcvqpeh3jg6',
                'price'           => 22.00,   // or 990 if integer cents
                'quantity'        => 50,
                'is_popular'      => false
            ],
            [
                'name'            => 'Pro Plan',
                'features'        => ['Unlimited projects', 'Advanced analytics', 'Priority support'],
                'description'     => 'Best for growing teams that ship often. Run unlimited projects, unlock deeper analytics, and get priority support for faster iteration and issue resolution.',
                'paddle_price_id' => 'pri_01j36w7h2n1qaqxm0ngp6qwmdz',
                'price'           => 55.00,   // or 1990 if integer cents
                'quantity'        => 100,
                'is_popular'      => true
            ],
            [
                'name'            => 'Team Plan',
                'features'        => ['Unlimited seats', 'SSO', 'Dedicated success manager'],
                'description'     => 'Built for organizations that need scale and governance. Invite unlimited seats, streamline access with SSO, and partner with a dedicated success manager for rollout and training.',
                'paddle_price_id' => 'pri_01j37ac98ak8df5m0nk5kry3h6',
                'price'           => 79.00,   // or 4900 if integer cents
                'quantity'        => 250,
                'is_popular'      => false
            ],
        ];


        foreach ($products as $data) {
            // Make seeding repeatable without duplicates
            Product::updateOrCreate(
                ['paddle_price_id' => $data['paddle_price_id']],
                $data
            );
        }
    }
}
