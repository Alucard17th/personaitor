<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('alucard_posts', function (Blueprint $table) {
          
            $table->string('meta_title')->nullable();
            $table->string('meta_keywords')->nullable();
        });
    }

    public function down()
    {
        Schema::table('alucard_posts', function (Blueprint $table) {
            $table->dropColumn('meta_title');
            $table->dropColumn('meta_keywords');
        });
    }
};

