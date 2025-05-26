<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Enrollments extends Model
{
    use HasFactory;

    protected $fillable = ['student_id', 'course_id', 'progress', 'grade'];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

}
