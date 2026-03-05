export type CarStatus = 'in_stock' | 'sold' | 'reserved' | 'expected';
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid';
export type Transmission = 'automatic' | 'manual' | 'robot';
export type Drive = 'front' | 'rear' | 'awd' | '4wd';
export type BodyType = 'sedan' | 'hatchback' | 'suv' | 'coupe' | 'wagon' | 'minivan' | 'pickup' | 'van' | 'cabrio';

export interface CarImage {
    id: number;
    image: string;
    image_url: string;
    is_primary: boolean;
    order: number;
    uploaded_at: string;
}

export interface Car {
    id: number;
    brand: string;
    model: string;
    year: number;
    price: number;
    formatted_price: string;
    mileage: number | null;
    formatted_mileage: string;
    vin: string | null;
    color: string;
    engine_volume: number | null;
    engine_power: number | null;
    fuel_type: FuelType;
    transmission: Transmission;
    drive: Drive;
    body_type: BodyType;
    description: string;
    equipment: Record<string, any>;
    status: CarStatus;
    views_count: number;
    images: CarImage[];
    main_image: string | null;
    images_count: number;
    created_at: string;
    updated_at: string;
}

export interface CarFilters {
    brand?: string;
    model?: string;
    price_min?: number;
    price_max?: number;
    year_min?: number;
    year_max?: number;
    transmission?: Transmission[];
    drive?: Drive[];
    fuel_type?: FuelType[];
    body_type?: BodyType[];
    mileage_max?: number;
    status?: CarStatus;
    search?: string;
}

export interface CarCreateData {
    brand: string;
    model: string;
    year: number;
    price: number;
    mileage?: number | null;
    vin?: string | null;
    color?: string;
    engine_volume?: number | null;
    engine_power?: number | null;
    fuel_type?: FuelType;
    transmission?: Transmission;
    drive?: Drive;
    body_type?: BodyType;
    description?: string;
    equipment?: Record<string, any>;
    status?: CarStatus;
    images?: File[];
}

export interface Brand {
    id: number;
    name: string;
    logo: string | null;
    country: string;
    is_active: boolean;
}

export interface CarModel {
    id: number;
    brand: number;
    brand_name: string;
    name: string;
    generation: string;
    year_start: number;
    year_end: number | null;
}