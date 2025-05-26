<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request; // Add this import at the top
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
    //     $query = $request->get('query'); // Get the search query from request

    //     $users = User::query();
    
    //     // If a query is provided, filter by name or email
    //     if ($query) {
    //         $users->where(function ($queryBuilder) use ($query) {
    //             $queryBuilder->where('name', 'LIKE', "%$query%")
    //                          ->orWhere('email', 'LIKE', "%$query%");
    //         });
    //     }
    //     return UserResource::collection(User::query()->orderBy('id', 'desc')->paginate(10));
    // 

$query = $request->query('query','');
$users = User::query();

if ($query) {
    $users->where(function ($queryBuilder) use ($query) {
        $queryBuilder->where('name', 'LIKE', "%$query%")
                     ->orWhere('email', 'LIKE', "%$query%");
    });
}
$users->select('id', 'name', 'email', 'role', 'designation','grade','salary','created_at',  'updated_at');

return UserResource::collection(
    $users->orderBy('id', 'desc')->paginate(10)
);    


}
public function getTeachers(Request $request)
{
    // Fetch query parameters
    $query = $request->input('query', ''); // Search query
    $perPage = $request->input('per_page', 10); // Items per page, default 10

    // Query users where designation is Teacher
    $teachers = User::where('designation', 'Teacher')
        ->when($query, function ($q) use ($query) {
            // Filter by name or email if query is provided
            $q->where(function ($q) use ($query) {
                $q->where('name', 'like', "%$query%")
                  ->orWhere('email', 'like', "%$query%");
            });
        })
        ->paginate($perPage); // Paginate the results

    // Return paginated list of teachers
    return response()->json($teachers);
} 

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\StoreUserRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $data['password'] = bcrypt($data['password']);
        $user = User::create($data);

        return response(new UserResource($user) , 201);
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\UpdateUserRequest $request
     * @param \App\Models\User                     $user
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        //  // Only allow admins to edit other users
        //  if (!Auth::user()->hasRole('admin')) {
        //     return response()->json(['error' => 'Unauthorized'], 403);
        // }
        $data = $request->validated();
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }
        $user->update($data);

        return new UserResource($user);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
         // Only allow admins to delete other users
         if (!Auth::user()->hasRole('admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

            $user->delete();
        
            return response()->json(['message' => 'User successfully deleted'], 200); // Changed to 200 OK with message
        }
    }