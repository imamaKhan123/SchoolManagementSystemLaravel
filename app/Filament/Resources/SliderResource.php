<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SliderResource\Pages;
use App\Filament\Resources\SliderResource\RelationManagers;
use App\Models\Slider;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class SliderResource extends Resource
{
    protected static ?string $model = Slider::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\FileUpload::make('image_path')
                ->label('Image')
                ->required()
                ->directory('slider_images') // Directory in the `storage/app/public` folder
                ->image()   
                ->disk('public') ,
            Forms\Components\TextInput::make('caption')
                ->label('Caption')
                ->maxLength(255),
            Forms\Components\TextInput::make('title')
                ->label('Title')
                ->maxLength(255),
            Forms\Components\Textarea::make('description')
                ->label('Description'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image_path')
                ->label('Image')
                ->size(100)
                ->getStateUsing(fn ($record) => asset('storage/' . $record->image_path)) ,// Generate correct URL
                
                // ->url(fn ($record) => asset('storage/' . $record->image_path)), // Generate correct URL
           Tables\Columns\TextColumn::make('caption')
                ->label('Caption'),
            Tables\Columns\TextColumn::make('title')
                ->label('Title'),
            Tables\Columns\TextColumn::make('description')
                ->label('Description')
                ->limit(50),
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
            'index' => Pages\ListSliders::route('/'),
            'create' => Pages\CreateSlider::route('/create'),
            'edit' => Pages\EditSlider::route('/{record}/edit'),
        ];
    }
}
