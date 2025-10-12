<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('alucard_posts', function (Blueprint $table) {
            // Add user_id column to link posts to users
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Add featured_image column (nullable)
            $table->string('featured_image')->nullable()->after('content');
        });
    }

    public function down()
    {
        Schema::table('alucard_posts', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['user_id', 'featured_image']);
        });
    }
};

