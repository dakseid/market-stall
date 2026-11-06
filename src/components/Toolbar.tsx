import type { Category, SortOption } from "../types";
import Input from "./Input";

interface ToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  categories: Category[];
}

export default function Toolbar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  categories,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <Input
        label="Search products"
        hideLabel
        type="search"
        placeholder="Search products..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="field">
        <label htmlFor="category" className="sr-only">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="sort" className="sr-only">
          Sort by
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
        >
          <option value="default">Sort: Featured</option>
          <option value="price-asc">Price: Low to high</option>
          <option value="price-desc">Price: High to low</option>
        </select>
      </div>
    </div>
  );
}