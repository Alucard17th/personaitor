<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('alucard_posts', function (Blueprint $table) {
          
            $table->string('meta_description')->nullable();
        });
    }

    public function down()
    {
        Schema::table('alucard_posts', function (Blueprint $table) {
            $table->dropColumn('meta_description');
        });
    }
};

