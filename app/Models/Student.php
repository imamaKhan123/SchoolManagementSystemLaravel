<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Documents;
use App\Models\Enrollments;
class Student extends Model
{
    
    use HasFactory;

    protected $fillable = ['user_id', 'grade', 'marks','approved'];

    // Define the relationship with User
    public function user()
    {
        return $this->belongsTo(User::class);
    }public function documents()
    {
        return $this->hasMany(Documents::class);
    }
    
    public function enrollments()
    {
        return $this->hasMany(Enrollments::class, 'student_id');
    }
    public function profilePicture()
    {
        return $this->hasOne(Documents::class)->where('type', 'profile_picture');
    }
    public function courses()
    {
        return $this->belongsToMany(Course::class, 'enrollments');
    }
   
}
