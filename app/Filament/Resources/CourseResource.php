<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CourseResource\Pages;
use App\Filament\Resources\CourseResource\RelationManagers;
use App\Models\Course;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Tables\Columns\TextColumn;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
class CourseResource extends Resource
{
    protected static ?string $model = Course::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $navigationLabel = 'Courses';

    protected static ?string $navigationGroup = 'School Management';
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                   // Define the form fields for courses
            TextInput::make('name')
            ->label('Course Name') // Label for the course name field
            ->required() // Make this field required
            ->maxLength(255), // Limit the length to 255 characters

        TextInput::make('code')
            ->label('Course Code') // Label for the course code field
            ->required() // Make this field required
            ->maxLength(100) // Limit the length to 100 characters
            ->unique(Course::class, 'code', fn ($record) => $record), // Ensure the code is unique

        Textarea::make('description')
            ->label('Course Description') // Label for the course description field
            ->required() // Make this field required
            ->maxLength(1000) // Limit the description to 1000 characters
            ->helperText('Provide a brief description of the course.'), // Optional helper text
        
            Select::make('teacher_id')
            ->label('Assigned Teacher')
            ->relationship('teacher', 'name') // Assuming `teacher` relationship exists in the `Course` model
            ->required()
            ->options(User::where('designation', 'teacher') // Filter users by designation
                ->pluck('name', 'id'))
            ->searchable(), // Allow searching teachers by name
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
            
                TextColumn::make('name')
                ->label('Course Name')
                ->searchable(), // Allow searching by course name

            TextColumn::make('code')
                ->label('Course Code')
                ->searchable(), // Allow searching by course code

            TextColumn::make('description')
                ->label('Description')
                ->limit(50) // Limit the description length displayed in the table
                ->searchable(), // Allow searching by course description
                TextColumn::make('teacher.name') // Assuming `teacher` relationship exists
                ->label('Assigned Teacher'),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCourses::route('/'),
            'create' => Pages\CreateCourse::route('/create'),
            'edit' => Pages\EditCourse::route('/{record}/edit'),
        ];
    }
}
