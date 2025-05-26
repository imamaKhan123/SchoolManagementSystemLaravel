<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignmentSubmission extends Model
{
    use HasFactory;

    protected $fillable = ['assignment_id', 'user_id', 'file_path' ,
    'grade', 
    'feedback'];
    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }
     // Relationship to the User model
     public function user()
     {
         return $this->belongsTo(User::class);
     }
}
