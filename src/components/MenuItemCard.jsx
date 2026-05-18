function MenuItemCard({ item, quantity, onAdd, onIncrease, onDecrease, darkMode }) {
  const isVeg = item.is_veg === false ? false : true;
  const imageUrl = item.image_url || item.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop";
  const bestseller = item.bestseller || item.is_bestseller || false;

  return (
    <div className={`group border rounded-lg p-3 transition ${darkMode ? "border-white/10 bg-[#0d1728] hover:bg-[#111d33]" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
      <div className="flex gap-3 items-center justify-between">
        {/* Left Side - Item Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`flex-shrink-0 inline-flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${isVeg ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
              {isVeg ? "🟢" : "🔴"}
            </span>
            {bestseller && <span className="text-xs font-bold bg-orange-500 text-white px-2 py-0.5 rounded">Bestseller</span>}
          </div>
          
          <h3 className="mt-2 text-sm font-bold text-white truncate">{item.name || item.item_name || "Item"}</h3>
          
          <p className="mt-1 text-xs font-semibold text-orange-300">₹{item.price}</p>
          
          {item.description && (
            <p className="mt-1 text-xs text-slate-400 line-clamp-2">{item.description}</p>
          )}
          
          {item.rating && (
            <p className="mt-1 text-xs text-slate-300">⭐ {item.rating}</p>
          )}
        </div>

        {/* Right Side - Image & Add Button */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <div className="relative overflow-hidden rounded-lg border border-white/10 bg-slate-950 w-20 h-20">
            <img 
              src={imageUrl} 
              alt={item.name || item.item_name} 
              className="w-full h-full object-cover transition duration-500 group-hover:scale-110" 
              loading="lazy" 
            />
          </div>
          
          {quantity > 0 ? (
            <div className="flex items-center gap-1 rounded-lg bg-orange-500/20 px-2 py-1">
              <button 
                type="button" 
                onClick={onDecrease} 
                className="h-6 w-6 rounded-full bg-red-500 text-white text-xs font-bold transition hover:bg-red-600"
              >
                −
              </button>
              <div className="w-6 text-center text-xs font-bold text-white">{quantity}</div>
              <button 
                type="button" 
                onClick={onIncrease} 
                className="h-6 w-6 rounded-full bg-green-500 text-white text-xs font-bold transition hover:bg-green-600"
              >
                +
              </button>
            </div>
          ) : (
            <button 
              type="button" 
              onClick={onAdd} 
              className="rounded-lg border-2 border-orange-500 bg-white text-orange-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition hover:bg-orange-50"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuItemCard;
