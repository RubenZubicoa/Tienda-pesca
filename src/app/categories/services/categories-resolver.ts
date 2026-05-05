import { ResolveFn } from '@angular/router';
import { CategoryService } from '../../core/services/category';
import { inject } from '@angular/core';
import { Category } from '../../core/models/Category';

export const categoriesResolver: ResolveFn<Category> = (route, state) => {
  const categoryService = inject(CategoryService);
  return categoryService.getCategory(route.params['uuid']);
};
