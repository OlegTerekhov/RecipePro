# RecipePro nutrition data audit

Audit date: 2026-10-13

## Scope

Reviewed the 39-item local product catalog, the shared nutrition engine, the food diary resolver, and all 8 bundled recipes.

## Changes made

- Corrected tuna to a named reference food: raw yellowfin tuna, USDA FoodData Central SR Legacy record 175159 — 109 kcal, 24.4 g protein, 0.5 g fat, 0 g carbohydrate per 100 g.
- Corrected shrimp to raw shrimp, USDA FoodData Central SR Legacy record 175179 — 85 kcal, 20.1 g protein, 0.5 g fat, 0 g carbohydrate per 100 g.
- Added source metadata to these two records so their origin is inspectable in code.
- Updated approximate cooked-yield factors for tuna and shrimp so cooked-weight estimates start from the raw reference values rather than treating cooked-food nutrition as raw-food nutrition.
- Added the 5 g of cooking oil to the omelet, rice-and-chicken, and chicken-pasta recipes, whose instructions explicitly fry ingredients. The chicken-and-potato recipe already listed its oil.
- Removed the low-calorie filter from oatmeal with banana and milk; the full serving is not reliably low-calorie.
- Added automated checks for catalog completeness, raw seafood reference values, recipe ingredient IDs, quantities, units, steps, oil accounting, and the oatmeal filter.
- Kept generic product matching conservative: an unknown or ambiguous food should not silently become a different food.

## Data quality and interpretation

All local catalog records have a display name, numeric non-negative kcal/protein/fat/carbohydrate fields, and a positive cooking-yield factor. All bundled recipe ingredients reference known product IDs and use supported units.

Most of the other catalog entries are generic reference estimates, not exact matches to a specific branded package or a single verified USDA record. For example, “cheese”, “pork”, “beef”, “yogurt”, and “salmon” vary materially by fat content, cut, species, and manufacturer. Their numbers are useful estimates, not guaranteed label values. When a package label is available, use that label as the authority.

Cooking-yield factors are also approximations. Water absorption and loss depend on cooking method, time, and the amount of water retained. A single yield ratio cannot model every boiled, roasted, grilled, and fried preparation, and the current engine does not fully model nutrients lost with rendered fat or discarded cooking liquid. We should not describe every cooked-weight result as laboratory-accurate.

Calories do not always equal a simple 4/4/9 calculation from displayed macros: food databases may use food-specific energy factors, carbohydrates may include fiber, and values are rounded. Therefore, the audit does not overwrite source calories merely to force every record to match a simple macro formula.

## References

- USDA FoodData Central data documentation: https://fdc.nal.usda.gov/data-documentation/
- USDA FoodData Central API guide: https://fdc.nal.usda.gov/api-guide/
- Raw yellowfin tuna, USDA SR Legacy FDC 175159: https://fdc.nal.usda.gov/food-details/175159/nutrients
- Raw shrimp, USDA SR Legacy FDC 175179: https://fdc.nal.usda.gov/food-details/175179/nutrients

## Remaining limitation

The audit validates internal consistency and corrects identified source/state mismatches; it does not claim that every generic estimate is exact for every food sold. A genuinely exact package-level catalog requires a specific brand/product label or a verified source record per item.