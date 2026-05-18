function CategoryCard({ category }) {
  return (
    <div className="bg-white min-w-[100px] rounded-2xl shadow-sm p-4 flex flex-col items-center justify-center hover:scale-105 transition">

      <div className="text-4xl">
        <img src={category.image} alt={category.name} className="w-12 h-12" />
      </div>

      <p className="mt-2 font-medium text-gray-700">
        {category.name}
      </p>

    </div>
  );
}

export default CategoryCard;