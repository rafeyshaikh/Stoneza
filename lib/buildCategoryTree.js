export function buildCategoryTree(categories) {
  const map = new Map();

  categories.forEach((category) => {
    map.set(category._id, {
      ...category,
      children: [],
    });
  });

  const roots = [];

  categories.forEach((category) => {
    if (!category.parentCategory) {
      roots.push(map.get(category._id));
      return;
    }

    const parentId =
      typeof category.parentCategory === "object"
        ? category.parentCategory._id
        : category.parentCategory;

    const parent = map.get(parentId);

    if (parent) {
      parent.children.push(map.get(category._id));
    }
  });

  return roots;
}