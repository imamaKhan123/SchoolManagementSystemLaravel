<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = ['student_id', 'date', 'status'
];

    // Relationship with User
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id'); // Ensure correct foreign key is used
    }
    public function attendances()
{
    return $this->hasMany(Attendance::class, 'student_id'); // Ensure correct foreign key is used
}

}
