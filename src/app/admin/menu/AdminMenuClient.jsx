"use client";

import { useEffect, useState } from "react";
import { getLocalMenu, saveLocalMenu } from "@/app/lib/client-menu";

const emptyDish = {
  name: "",
  slug: "",
  description: "",
  price: "",
  category: "Main Course",
  ingredients: "",
  image: "",
  isAvailable: true,
};

const inputClass =
  "w-full rounded-lg border border-[#d8dfd5] bg-white px-3 py-2.5 text-sm text-[#203b2d] outline-none focus:border-[#244b36]";

export default function AdminMenuClient() {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState(emptyDish);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      setMenu(getLocalMenu());
    } catch {
      setError("Unable to load menu data from localStorage.");
    } finally {
      setLoaded(true);
    }
  }, []);

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function resetForm() {
    setForm(emptyDish);
    setEditingId(null);
    setError("");
  }

  function persistMenu(nextMenu) {
    try {
      saveLocalMenu(nextMenu);
      setMenu(nextMenu);
      setError("");
      return true;
    } catch {
      setError("Could not save menu changes. Check browser storage.");
      return false;
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.description.trim()) {
      setError("Enter a dish name and description.");
      return;
    }

    const price = Number(form.price);

    if (!Number.isFinite(price) || price < 0) {
      setError("Enter a valid price.");
      return;
    }

    const slug =
      form.slug.trim() ||
      form.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const duplicateSlug = menu.some(
      (dish) => dish.slug === slug && String(dish.id) !== String(editingId),
    );

    if (duplicateSlug) {
      setError("That slug is already being used by another dish.");
      return;
    }

    const dish = {
      ...form,
      id: editingId ?? `dish-${crypto.randomUUID()}`,
      name: form.name.trim(),
      slug,
      description: form.description.trim(),
      price,
      category: form.category.trim() || "Main Course",
      ingredients: form.ingredients
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      image: form.image.trim(),
      isAvailable: Boolean(form.isAvailable),
    };

    const nextMenu = editingId
      ? menu.map((item) =>
          String(item.id) === String(editingId) ? dish : item,
        )
      : [...menu, dish];

    if (persistMenu(nextMenu)) resetForm();
  }

  function editDish(dish) {
    setEditingId(dish.id);
    setForm({
      name: dish.name ?? "",
      slug: dish.slug ?? "",
      description: dish.description ?? "",
      price: String(dish.price ?? ""),
      category: dish.category ?? "Main Course",
      ingredients: Array.isArray(dish.ingredients)
        ? dish.ingredients.join(", ")
        : "",
      image: dish.image ?? "",
      isAvailable: dish.isAvailable !== false,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteDish(dish) {
    if (!window.confirm(`Delete "${dish.name}" from the menu?`)) {
      return;
    }

    const nextMenu = menu.filter((item) => String(item.id) !== String(dish.id));

    if (String(editingId) === String(dish.id)) resetForm();

    persistMenu(nextMenu);
  }

  function toggleAvailability(dish) {
    const nextMenu = menu.map((item) =>
      String(item.id) === String(dish.id)
        ? { ...item, isAvailable: !item.isAvailable }
        : item,
    );

    persistMenu(nextMenu);
  }

  const filteredMenu = menu.filter((dish) =>
    `${dish.name} ${dish.category}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  if (!loaded) {
    return <p className="p-6 text-[#203b2d]">Loading menu...</p>;
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wider text-[#bd7137]">
          Adis Eats Admin
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#203b2d]">
          Menu Management
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Add dishes, update prices, and manage availability.
        </p>
      </header>

      <section className="rounded-2xl border border-[#e3e8df] bg-white p-5 shadow-sm sm:p-7">
        <h2 className="mb-5 text-xl font-bold text-[#203b2d]">
          {editingId ? "Edit Dish" : "Add New Dish"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm font-medium">
              Dish name *
              <input
                className={inputClass}
                name="name"
                value={form.name}
                onChange={updateField}
                required
                placeholder="Doro Wat"
              />
            </label>

            <label className="space-y-1 text-sm font-medium">
              Price (ETB) *
              <input
                className={inputClass}
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={updateField}
                required
              />
            </label>

            <label className="space-y-1 text-sm font-medium">
              URL slug
              <input
                className={inputClass}
                name="slug"
                value={form.slug}
                onChange={updateField}
                placeholder="doro-wat"
              />
            </label>

            <label className="space-y-1 text-sm font-medium">
              Category
              <input
                className={inputClass}
                name="category"
                value={form.category}
                onChange={updateField}
                placeholder="Main Course"
              />
            </label>

            <label className="space-y-1 text-sm font-medium sm:col-span-2">
              Description *
              <textarea
                className={inputClass}
                name="description"
                value={form.description}
                onChange={updateField}
                rows={3}
                required
              />
            </label>

            <label className="space-y-1 text-sm font-medium sm:col-span-2">
              Ingredients (separated by commas)
              <input
                className={inputClass}
                name="ingredients"
                value={form.ingredients}
                onChange={updateField}
                placeholder="Chicken, berbere, onions"
              />
            </label>

            <label className="space-y-1 text-sm font-medium sm:col-span-2">
              Image path or URL
              <input
                className={inputClass}
                name="image"
                value={form.image}
                onChange={updateField}
                placeholder="/images/doro-wat.jpg"
              />
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isAvailable"
              checked={form.isAvailable}
              onChange={updateField}
              className="accent-[#244b36]"
            />
            Available to order
          </label>

          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-lg bg-[#244b36] px-5 py-3 font-semibold text-white hover:bg-[#183b29]"
            >
              {editingId ? "Save Changes" : "Add Dish"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-5 py-3 font-semibold"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-[#203b2d]">
            Current Menu ({menu.length})
          </h2>

          <input
            className={`${inputClass} sm:max-w-xs`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search dishes..."
            aria-label="Search dishes"
          />
        </div>

        {filteredMenu.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
            {menu.length === 0
              ? "No dishes found. Add your first dish above."
              : "No dishes match your search."}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#e3e8df] bg-white">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-[#e9f0e6] text-[#203b2d]">
                <tr>
                  <th className="p-4">Dish</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Availability</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredMenu.map((dish) => (
                  <tr key={dish.id} className="border-t border-gray-100">
                    <td className="p-4">
                      <p className="font-semibold text-[#203b2d]">
                        {dish.name}
                      </p>
                      <p className="mt-1 max-w-xs truncate text-gray-500">
                        {dish.description}
                      </p>
                    </td>

                    <td className="p-4">{dish.category}</td>

                    <td className="p-4 font-medium">
                      {Number(dish.price).toLocaleString("en-ET")} ETB
                    </td>

                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => toggleAvailability(dish)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          dish.isAvailable
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {dish.isAvailable ? "Available" : "Unavailable"}
                      </button>
                    </td>

                    <td className="p-4">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => editDish(dish)}
                          className="font-semibold text-[#244b36] underline"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteDish(dish)}
                          className="font-semibold text-red-700 underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
