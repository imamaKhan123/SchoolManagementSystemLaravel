<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Assignment extends Model
{
    use HasFactory;

    // Explicitly define the table name if it's not the default plural form of the model name
    protected $table = 'assignments';

    // Fillable fields to allow mass assignment
    protected $fillable = [
        'title',
        'description',
        'course_id',
        'due_date',
        'file_path',
    ];

    /**
     * Define the relationship with the Course model.
     * An assignment belongs to a single course.
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Define the relationship with the Submission model.
     * An assignment can have many submissions.
     */
    public function submission()
    {
        return $this->hasOne(AssignmentSubmission::class)
            ->where('user_id', auth()->id());
    }

    /**
     * Get the submission for a specific user.
     * This can be used to check if a user has already submitted.
     */
    public function submissionForUser($userId)
    {
        return $this->submissions()->where('user_id', $userId)->first();
    }
}
