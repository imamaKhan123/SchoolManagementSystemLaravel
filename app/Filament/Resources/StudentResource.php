<?php

namespace App\Filament\Resources;

use App\Filament\Resources\StudentResource\Pages;
use App\Filament\Resources\StudentResource\RelationManagers;
use App\Models\Student;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Actions\Action;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

use Filament\Forms\Components\TextInput; // Import this for forms
use Filament\Forms\Components\FileUpload; // Import this for file uploads
class StudentResource extends Resource
{
    protected static ?string $model = Student::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';


    protected static ?string $navigationLabel = 'Students';

    protected static ?string $navigationGroup = 'School Management';
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                
                TextInput::make('user.name')
                ->label('Name')
                ->required(),
            TextInput::make('user.email')
                ->label('Email')
                ->email()
                ->required(),
            FileUpload::make('documents')
                ->label('Documents')
                ->multiple()
                ->disk('public')
                ->directory('documents'),
                Forms\Components\TextInput::make('grade')
                ->label('Grade')
                ->required(),
            Forms\Components\TextInput::make('marks')
                ->label('Marks')
                ->numeric(),
                
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('profilePicture.file_path')
                ->label('Profile Picture')
                ->disk('public') // Ensure this is set to 'public'
                // ->getStateUsing(fn ($record) => asset('storage/' . $record->file_path)) // Generate correct URL
                 ->getStateUsing(fn ($record) => $record->profilePicture ? asset('storage/' . $record->profilePicture->file_path) : null)
                ->width(50)
                ->height(50),
                Tables\Columns\TextColumn::make('user.name')
                ->label('Name')
                ->searchable()
                ->sortable(),
            Tables\Columns\TextColumn::make('user.email')
                ->label('Email')
                ->searchable()
                ->sortable(),
            Tables\Columns\TextColumn::make('user.grade')
                ->label('Grade')
                ->sortable(),
                Tables\Columns\TextColumn::make('user.salary')
                ->label('Fee')
                ->sortable(),
            // Tables\Columns\TextColumn::make('marks')
            //     ->label('Marks')
            //     ->sortable(),
            Tables\Columns\BooleanColumn::make('approved')->label('Approved')->sortable(),
          


               
            

            ])
            ->filters([
                //
            ])
            ->actions([
                Action::make('approve')
                ->label('Approve')
                ->color('success')  // Add color to make it stand out
                ->action(function (Student $record) {
                    // Set the approved status to true
                    $record->update(['approved' => true]);
                })
                ->icon('heroicon-o-check-circle') // Add an icon
                ->requiresConfirmation() // Confirmation before approval
                ->modalHeading('Approve Student') // Modal heading for confirmation
                ->modalSubheading('Are you sure you want to approve this student?'),

            Action::make('reject')
                ->label('Reject')
                ->color('danger')
                ->action(function (Student $record) {
                    // Set the approved status to false
                    $record->update(['approved' => false]);
                })
                ->icon('heroicon-o-x-circle') // Add a reject icon
                ->requiresConfirmation()  // Confirmation before rejection
                ->modalHeading('Reject Student')
                ->modalSubheading('Are you sure you want to reject this student?'),
       



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
            'index' => Pages\ListStudents::route('/'),
            'create' => Pages\CreateStudent::route('/create'),
            'edit' => Pages\EditStudent::route('/{record}/edit'),
        ];
    }
}
