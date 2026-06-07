function CategoryCard({ category }) {
  return (
    <div className="min-w-[100px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:scale-105 dark:border-slate-700 dark:bg-slate-800">

      <div className="text-4xl">
        <img src={category.image} alt={category.name} className="h-12 w-12" />
      </div>

      <p className="mt-2 font-medium text-slate-700 dark:text-slate-200">
        {category.name}
      </p>

    </div>
  );
}

export default CategoryCard;