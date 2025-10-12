<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('alucard_posts', function (Blueprint $table) {
            //
            $table->boolean('display_related_posts')->default(false);
            $table->json('related_posts')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('alucard_posts', function (Blueprint $table) {
            //
            $table->dropColumn('display_related_posts');
            $table->dropColumn('related_posts');
        });
    }
};
