import { Car } from './car.types';
import { User } from './user.types';

export interface Favorite {
    id: number;
    user: number;
    car: Car;
    created_at: string;
}

export interface FavoriteCreateData {
    car: number;
}

export interface FavoriteCheckResponse {
    in_favorites: boolean;
}

export interface FavoritesState {
    items: Favorite[];
    favoriteIds: number[];
    isLoading: boolean;
    error: string | null;
}