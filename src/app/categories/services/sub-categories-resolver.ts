import { ResolveFn } from '@angular/router';
import { CategoryService } from '../../core/services/category';
import { inject } from '@angular/core';
import { Category } from '../../core/models/Category';
import { map, of } from 'rxjs';

export const subCategoriesResolver: ResolveFn<Category | undefined> = (route, state) => {
  const categoryService = inject(CategoryService);
  const parentCategoryUuid = route.params['parentCategoryUuid'];
  const subCategoryUuid = route.params['subCategoryUuid'];
  if (!parentCategoryUuid || !subCategoryUuid) {
    return of(undefined);
  }
  return categoryService.getCategory(parentCategoryUuid).pipe(
    map(category => category.children?.find(child => child.uuid === subCategoryUuid))
  );
};
