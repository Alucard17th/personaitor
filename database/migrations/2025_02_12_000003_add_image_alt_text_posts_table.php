<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('alucard_posts', function (Blueprint $table) {
          
            $table->string('image_alt_text')->nullable();
        });
    }

    public function down()
    {
        Schema::table('alucard_posts', function (Blueprint $table) {
            $table->dropColumn('image_alt_text');
        });
    }
};

