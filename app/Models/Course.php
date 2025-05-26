<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Course extends Model
{
    //
    use HasFactory;

    protected $fillable = ['name', 'code', 'description', 'teacher_id'];

    // Relationship with the students through enrollments
    public function enrollments()
    {
        return $this->hasMany(Enrollments::class);
    }

    // Relationship with students via enrollments
    public function students()
    {
        return $this->belongsToMany(Student::class, 'enrollments');
    }public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }
     // Relationship with teacher
     public function teacher()
     {
         return $this->belongsTo(User::class, 'teacher_id');
     }
}
