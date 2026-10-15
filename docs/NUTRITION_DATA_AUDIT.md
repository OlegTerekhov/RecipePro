# RecipePro nutrition data audit

Audit date: 2026-10-15

## Scope

Reviewed the current 506-item local product catalog, shared nutrition engine, food-diary product resolver, bundled recipes, product lookup/cache flow, and automated repository checks.

## Current checks

- The local catalog contains 506 unique product IDs.
- Each catalog record includes a display name, raw nutrition values, a cooking-yield ratio, and nutrition-source metadata.
- The catalog's cooking-yield ratios are positive and within the validator's allowed range. Dry grains and legumes use higher ratios to account approximately for absorbed water.
- Five records link to specific USDA FoodData Central SR Legacy entries: raw chicken breast (171077), raw yellowfin tuna (175159), raw shrimp (175179), potato (170026), and dry long-grain rice (169756).
- The other entries are generic reference estimates, not verified matches to every brand, cut, species, or package sold.
- Automated tests cover raw and cooked-weight calculations, frying-oil accounting, unknown product handling, catalog completeness, product resolution, recommendations, meal planning, security baselines, and cloud-save account binding.
- The nutrition engine prevents a recipe that already lists oil from having additional frying oil automatically added a second time.
- The external product resolver rejects results with missing macro values instead of silently importing those missing values as zero, and persists usable product snapshots in its local cache.

## Interpretation and limits

Nutrition values are stated per 100 g unless the record or source says otherwise. Use the package label when available, especially for branded products.

Cooking-yield factors are approximations. Water absorption and loss depend on cooking method, time, and how much water remains in the food. A single ratio cannot model every boiled, roasted, grilled, and fried preparation. The current engine also does not fully model nutrients lost with rendered fat or discarded cooking liquid, so cooked-weight results are estimates rather than laboratory measurements.

Calories do not always equal a simple 4/4/9 calculation from displayed macros: food databases may use food-specific energy factors, carbohydrates may include fiber, and values are rounded. A macro-calorie difference alone is not sufficient evidence that a record is wrong.

## References

- USDA FoodData Central datasets: https://fdc.nal.usda.gov/download-datasets/
- USDA FoodData Central API guide: https://fdc.nal.usda.gov/api-guide/
- Raw chicken breast, FDC 171077: https://fdc.nal.usda.gov/food-details/171077/nutrients
- Raw yellowfin tuna, FDC 175159: https://fdc.nal.usda.gov/food-details/175159/nutrients
- Raw shrimp, FDC 175179: https://fdc.nal.usda.gov/food-details/175179/nutrients
- Potato, FDC 170026: https://fdc.nal.usda.gov/food-details/170026/nutrients
- Dry long-grain rice, FDC 169756: https://fdc.nal.usda.gov/food-details/169756/nutrients

## Remaining work

The current checks validate internal consistency and known calculation paths; they do not prove that every estimated nutrition value is exact. Expanding the number of independently verified source records should be done by matching each food to an appropriate database entry, not by assigning guessed values or treating different cuts and preparation states as equivalent.
