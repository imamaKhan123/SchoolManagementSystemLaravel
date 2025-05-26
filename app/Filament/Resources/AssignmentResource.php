<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AssignmentResource\Pages;
use App\Filament\Resources\AssignmentResource\RelationManagers;
use App\Models\Assignment;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class AssignmentResource extends Resource
{
    protected static ?string $model = Assignment::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $navigationGroup = 'Education';
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('title')
                ->required()
                ->maxLength(255),
            Forms\Components\Textarea::make('description')
                ->maxLength(65535),
            Forms\Components\Select::make('course_id')
                ->label('Course')
                ->relationship('course', 'name') // Assuming `name` is the course field
                ->required(),
            Forms\Components\DatePicker::make('due_date')
                ->label('Due Date')
                ->required(),
            Forms\Components\FileUpload::make('file_path') // File upload field
                ->label('Assignment File')
                ->directory('assignments') // Specify upload directory
                ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('course.name') // Assuming the course relationship is defined
                    ->label('Course')
                    ->sortable(),
                    Tables\Columns\TextColumn::make('due_date')
                    ->date('F j, Y') // Format the date as needed
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime('F j, Y H:i')
                    ->label('Created At'),
                // Displaying the file as a clickable download link
            Tables\Columns\TextColumn::make('file_path')
            ->label('Assignment File')
            ->url(fn ($record) => asset('storage/' . $record->file_path), true) // Linking to the file path
            ->sortable(),
      
                
            ])
            ->filters([
                Tables\Filters\Filter::make('Overdue')
                ->query(fn (Builder $query) => $query->where('due_date', '<', now())),
       
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
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
            'index' => Pages\ListAssignments::route('/'),
            'create' => Pages\CreateAssignment::route('/create'),
            'edit' => Pages\EditAssignment::route('/{record}/edit'),
        ];
    }
}
