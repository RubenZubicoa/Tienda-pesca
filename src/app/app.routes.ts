import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
import { categoriesResolver } from './categories/services/categories-resolver';
import { subCategoriesResolver } from './categories/services/sub-categories-resolver';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./main/pages/main/main').then(m => m.Main)
    },
    {
        path: 'products/:uuid',
        loadComponent: () => import('./products/pages/product-detail/product-detail').then(m => m.ProductDetail),
    },
    {
        path: 'cart',
        loadComponent: () => import('./cart/pages/cart/cart').then(m => m.Cart),
    },
    {
        path: 'checkout',
        loadComponent: () => import('./checkout/pages/checkout/checkout').then(m => m.Checkout),
    },
    {
        path: 'login',
        loadComponent: () => import('./auth/pages/login/login').then(m => m.Login),
    },
    {
        path: 'account',
        canActivate: [authGuard],
        loadComponent: () => import('./account/pages/account/account').then(m => m.Account),
    },
    {
        path: 'categories/:uuid',
        loadComponent: () => import('./categories/pages/categories/categories').then(m => m.Categories),
        resolve: {
            category: categoriesResolver
        }
    },
    {
        path: 'categories/:parentCategoryUuid/subcategories/:subCategoryUuid',
        loadComponent: () => import('./categories/pages/categories/categories').then(m => m.Categories),
        resolve: {
            category: subCategoriesResolver
        }
    }
];
