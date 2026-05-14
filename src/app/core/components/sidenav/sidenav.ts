import { Component, DestroyRef, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { CategoryService } from '../../services/category';
import { Category } from '../../models/Category';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  imports: [],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
})
export class Sidenav implements OnInit {
  @Output() navigate = new EventEmitter<void>();

  protected expanded = new Set<string>();
  private categoryService = inject(CategoryService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  protected items = signal<Category[]>([]);

  ngOnInit(): void {
    this.categoryService.getCategories().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((categories) => {
      this.items.set(categories);
    });
  }

  protected toggle(label: string) {
    if (this.expanded.has(label)) {
      this.expanded.delete(label);
      return;
    }

    this.expanded.add(label);
  }

  protected isExpanded(label: string) {
    return this.expanded.has(label);
  }

  protected groupId(label: string) {
    return `sidenav-group-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  }

  navigateToCategory(category: Category) {
    this.router.navigate(['/categories', category.uuid]);
    this.navigate.emit();
  }

  navigateToSubCategory(parentCategory: Category, subCategory: Category) {
    this.router.navigate(['/categories', parentCategory.uuid, 'subcategories', subCategory.uuid]);
    this.navigate.emit();
  }
}

