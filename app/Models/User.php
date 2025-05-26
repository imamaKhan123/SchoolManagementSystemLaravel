<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
    use HasApiTokens;  // This is required for token creation
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */

     // Define role constants
    const ROLE_ADMIN = 'admin';
    const ROLE_USER = 'user';
    public function student()
{
    return $this->hasOne(Student::class);
}

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'designation',
        'salary',
        'grade'
        

        
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
     // Method to check the role
     public function hasRole($role)
     {
         return $this->role === $role;
     }
}
