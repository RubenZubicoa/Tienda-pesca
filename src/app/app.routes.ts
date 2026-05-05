import { Routes } from '@angular/router';
import { categoriesResolver } from './categories/services/categories-resolver';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./main/pages/main/main').then(m => m.Main)
    },
    {
        path: 'categories/:uuid',
        loadComponent: () => import('./categories/pages/categories/categories').then(m => m.Categories),
        resolve: {
            category: categoriesResolver
        }
    }
];
