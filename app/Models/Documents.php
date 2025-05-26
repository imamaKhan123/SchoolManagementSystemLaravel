<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Documents extends Model
{
    use HasFactory;

    protected $fillable = ['student_id', 'file_name', 'file_path','type'];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
