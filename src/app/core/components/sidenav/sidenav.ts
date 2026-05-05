import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CategoryService } from '../../services/category';
import { Category } from '../../models/Category';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

type SidenavItem = Readonly<{
  label: string;
  href: string;
  children?: readonly SidenavItem[];
}>;

@Component({
  selector: 'app-sidenav',
  imports: [],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
})
export class Sidenav implements OnInit {
  protected expanded = new Set<string>();
  private categoryService = inject(CategoryService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  protected items = signal<Category[]>([]);

  ngOnInit(): void {
    this.categoryService.getCategories().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((categories) => {
      console.log(categories);
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
    this.router.navigate(['/categories', category._id]);
  }
}

