<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('alucard_tag_post', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('post_id');
            $table->unsignedBigInteger('tag_id');
            $table->timestamps();

            $table->foreign('post_id')->references('id')->on('alucard_posts')->onDelete('cascade');
            $table->foreign('tag_id')->references('id')->on('alucard_tags')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('alucard_category_post', function (Blueprint $table) {
            $table->dropForeign(['post_id']);
            $table->dropForeign(['tag_id']);
        });
        Schema::dropIfExists('alucard_tag_post');
    }
};
