<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Filament\Resources\UserResource\RelationManagers;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                ->required()
                ->maxLength(255),
            Forms\Components\TextInput::make('email')
                ->email()
                ->required(),
            Forms\Components\TextInput::make('password')
                ->password()
                ->required()
                ->maxLength(255)
                ->hiddenOn('edit'), // Hide on edit to avoid overwriting passwords unintentionally
            Forms\Components\Select::make('role')
                ->options([
                    User::ROLE_ADMIN => 'Admin',
                    User::ROLE_USER => 'User',
                ])
                ->required(),
            Forms\Components\TextInput::make('designation')
                ->maxLength(255),
            Forms\Components\TextInput::make('salary')
                ->numeric()
                ->minValue(0),
            Forms\Components\TextInput::make('grade')
                ->maxLength(10),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('email')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('role')->sortable(),
                Tables\Columns\TextColumn::make('designation')->limit(20),
                Tables\Columns\TextColumn::make('salary')->sortable(),
                Tables\Columns\TextColumn::make('grade')->sortable(),
                Tables\Columns\TextColumn::make('password')->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->label('Created'),
            ])

            ->filters([
                Tables\Filters\SelectFilter::make('role')
                ->options([
                    User::ROLE_ADMIN => 'Admin',
                    User::ROLE_USER => 'User',
                ]),
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
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
