<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('alucard_category_post', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('post_id');
            $table->unsignedBigInteger('category_id');
            $table->timestamps();

            $table->foreign('post_id')->references('id')->on('alucard_posts')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('alucard_categories')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('alucard_category_post', function (Blueprint $table) {
            $table->dropForeign(['post_id']);
            $table->dropForeign(['category_id']);
        });
    
        Schema::dropIfExists('alucard_category_post');
    }
};
