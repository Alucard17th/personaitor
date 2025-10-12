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
                'features'        => [
                    'Access up to 20 personas',
                    'Basic analytics for campaigns',
                    'Email support for setup questions',
                    'Reusable templates for quick testing'
                ],
                'description'     => 'Ideal for solo marketers, designers, or early-stage founders. Launch and test campaigns using up to 20 personas with essential insights and email support to get started quickly.',
                'paddle_price_id' => 'pri_01j36w75011n0hzwcvqpeh3jg6', // replace with your actual Paddle ID
                'price'           => 9.99,
                'quantity'        => 20,
                'is_popular'      => false
            ],
            [
                'name'            => 'Pro Plan',
                'features'        => [
                    'Access up to 50 personas',
                    'Advanced analytics for campaigns',
                    'Priority email support',
                    'Reusable templates & campaign cloning',
                    'Collaboration for team insights'
                ],
                'description'     => 'Perfect for growing product teams and marketing teams. Manage campaigns across up to 50 personas, unlock deeper analytics, and collaborate efficiently with your team.',
                'paddle_price_id' => 'pri_01j36w7h2n1qaqxm0ngp6qwmdz', // replace with your actual Paddle ID
                'price'           => 24.99,
                'quantity'        => 50,
                'is_popular'      => true
            ],
            [
                'name'            => 'Team Plan',
                'features'        => [
                    'Access up to 150 personas',
                    'Full analytics dashboard',
                    'Dedicated success manager',
                    'Unlimited project and campaign management',
                    'Advanced collaboration features',
                    'Reusable templates for multiple teams'
                ],
                'description'     => 'Designed for established product teams and agencies. Manage large-scale campaigns with up to 150 personas, get full analytics, and enjoy dedicated support to scale your efforts.',
                'paddle_price_id' => 'pri_01j37ac98ak8df5m0nk5kry3h6', // replace with your actual Paddle ID
                'price'           => 49.99,
                'quantity'        => 150,
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
