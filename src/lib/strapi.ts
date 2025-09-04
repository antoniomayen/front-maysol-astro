// Strapi API Client
// Use different URLs for server-side vs client-side requests
const isServer = typeof window === 'undefined';
const STRAPI_URL = isServer 
  ? (import.meta.env.STRAPI_URL || 'http://localhost:1337')
  : (import.meta.env.PUBLIC_STRAPI_URL || 'http://localhost:8380/api');

const API_URL = isServer ? `${STRAPI_URL}/api` : STRAPI_URL;

// Product type definition - Strapi v5 format
export interface Product {
  id: number;
  documentId: string;
  name: string;
  description?: any;
  short_description?: string;
  price?: string;
  unit?: string;
  category?: 'huevos' | 'gallinas' | 'pollos' | 'cerdos' | 'alimentos' | 'accesorios';
  slug: string;
  featured: boolean;
  available: boolean;
  technical_info?: any;
  usage_instructions?: any;
  // SEO fields
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: {
    id: number;
    documentId: string;
    name: string;
    alternativeText?: string;
    url: string;
    width: number;
    height: number;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  image?: {
    id: number;
    documentId: string;
    name: string;
    alternativeText?: string;
    url: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: {
        url: string;
        width: number;
        height: number;
      };
    };
  };
  images?: Array<{
    id: number;
    documentId: string;
    name: string;
    alternativeText?: string;
    url: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: {
        url: string;
        width: number;
        height: number;
      };
    };
  }>;
}

// API Response types
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Fetch options
interface FetchOptions {
  populate?: string | string[];
  filters?: Record<string, any>;
  sort?: string | string[];
  pagination?: {
    page?: number;
    pageSize?: number;
  };
}

// Build query string from options
function buildQueryString(options: FetchOptions = {}): string {
  const params = new URLSearchParams();
  
  if (options.populate) {
    const populateValue = Array.isArray(options.populate) 
      ? options.populate.join(',') 
      : options.populate;
    params.append('populate', populateValue);
  }
  
  if (options.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      if (typeof value === 'object' && !Array.isArray(value)) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (Array.isArray(subValue)) {
            // Handle arrays like $in: ['value1', 'value2']
            subValue.forEach((item, index) => {
              params.append(`filters[${key}][${subKey}][${index}]`, String(item));
            });
          } else {
            params.append(`filters[${key}][${subKey}]`, String(subValue));
          }
        });
      } else if (Array.isArray(value)) {
        // Handle direct arrays
        value.forEach((item, index) => {
          params.append(`filters[${key}][${index}]`, String(item));
        });
      } else {
        params.append(`filters[${key}]`, String(value));
      }
    });
  }
  
  if (options.sort) {
    if (Array.isArray(options.sort)) {
      options.sort.forEach((sortItem, index) => {
        params.append(`sort[${index}]`, sortItem);
      });
    } else {
      params.append('sort[0]', options.sort);
    }
  }
  
  if (options.pagination) {
    if (options.pagination.page) {
      params.append('pagination[page]', String(options.pagination.page));
    }
    if (options.pagination.pageSize) {
      params.append('pagination[pageSize]', String(options.pagination.pageSize));
    }
  }
  
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

// Generic fetch function
async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const queryString = buildQueryString(options);
  const url = `${API_URL}${endpoint}${queryString}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from Strapi: ${url}`, error);
    throw error;
  }
}

// Product API functions
export async function getProducts(options: FetchOptions = {}): Promise<StrapiResponse<Product[]>> {
  const defaultOptions: FetchOptions = {
    populate: '*',
    sort: 'createdAt:desc',
    pagination: {
      pageSize: 100,
    },
    ...options,
  };
  
  return fetchAPI<StrapiResponse<Product[]>>('/products', defaultOptions);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const response = await fetchAPI<StrapiResponse<Product[]>>('/products', {
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: '*',
  });
  
  return response.data?.[0] || null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const response = await fetchAPI<StrapiResponse<Product[]>>('/products', {
    filters: {
      featured: {
        $eq: true,
      },
      available: {
        $eq: true,
      },
    },
    populate: '*',
    sort: 'createdAt:desc',
    pagination: {
      pageSize: 6,
    },
  });
  
  return response.data || [];
}

export async function getProductsByCategory(
  category: Product['category']
): Promise<Product[]> {
  const response = await fetchAPI<StrapiResponse<Product[]>>('/products', {
    filters: {
      category: {
        $eq: category,
      },
      available: {
        $eq: true,
      },
    },
    populate: '*',
    sort: 'name:asc',
  });
  
  return response.data || [];
}

// Helper function to get full image URL
export function getStrapiMediaUrl(url?: string): string {
  if (!url) return '/images/placeholder.jpg';
  
  // If it's already a full URL from Strapi, replace the internal URL with the public one
  if (url.startsWith('http')) {
    return url.replace('http://maysol_strapi_dev:1337', 'http://localhost:8380');
  }
  
  // Use the base Strapi URL (without /api) for media
  const baseUrl = 'http://localhost:8380';
  
  return `${baseUrl}${url}`;
}

// Category labels
export const categoryLabels: Record<string, string> = {
  huevos: 'Huevos',
  gallinas: 'Gallinas',
  pollos: 'Pollos',
  cerdos: 'Cerdos',
  alimentos: 'Alimentos',
  accesorios: 'Accesorios',
};