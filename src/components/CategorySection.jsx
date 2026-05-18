import { categories } from "../data/categories";
import CategoryCard from "./CategoryCard";

function CategorySection() {
  return (
    <div className="mt-8">

      <div className="flex items-center justify-between mb-4">

        <h2 className="text-2xl font-bold">
          Categories
        </h2>

        <button className="text-orange-500 font-medium">
          See All
        </button>

      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">

        {
          categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
            />
          ))
        }

      </div>

    </div>
  );
}

export default CategorySection;