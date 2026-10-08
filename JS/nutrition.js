/* =========================================================
   RECIPEPRO
   NUTRITION CALCULATOR
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const productInput = document.querySelector("#nutritionProduct");
    const amountInput = document.querySelector("#nutritionAmount");
    const stateSelect = document.querySelector("#nutritionState");
    const oilInput = document.querySelector("#nutritionOil");
    const addButton = document.querySelector("#nutritionAddProduct");
    const productList = document.querySelector("#nutritionProductList");
    const calculatorList = document.querySelector("#nutritionCalculatorList");
    const friedOptions = document.querySelector("#nutritionFriedOptions");

    const totalCalories = document.querySelector("#nutritionTotalCalories");
    const resultCalories = document.querySelector("#nutritionResultCalories");
    const resultProtein = document.querySelector("#nutritionResultProtein");
    const resultFat = document.querySelector("#nutritionResultFat");
    const resultCarbs = document.querySelector("#nutritionResultCarbs");

    if (!productInput || !amountInput || !stateSelect || !addButton || !calculatorList) {
        return;
    }

    const rows = [];

    function normalize(value) {
        return String(value || "")
            .toLowerCase()
            .replace(/ё/g, "е")
            .replace(/[^а-яa-z0-9]+/gi, " ")
            .trim();
    }

    function findProduct(value) {
        const products = window.products || {};
        const query = normalize(value);

        if (!query) {
            return null;
        }

        const entries = Object.entries(products);

        for (const entry of entries) {
            if (normalize(entry[0]) === query) {
                return { id: entry[0], product: entry[1] };
            }
        }

        for (const entry of entries) {
            if (normalize(entry[1].name) === query) {
                return { id: entry[0], product: entry[1] };
            }
        }

        for (const entry of entries) {
            const aliases = Array.isArray(entry[1].aliases)
                ? entry[1].aliases
                : [];

            if (aliases.some(alias => normalize(alias) === query)) {
                return { id: entry[0], product: entry[1] };
            }
        }

        for (const entry of entries) {
            const values = [
                entry[1].name,
                ...(entry[1].aliases || [])
            ].map(normalize);

            if (
                values.some(
                    value =>
                        value.includes(query) ||
                        query.includes(value)
                )
            ) {
                return { id: entry[0], product: entry[1] };
            }
        }

        return null;
    }

    function getStateLabel(state) {
        if (state === "boiled") {
            return "варёное";
        }

        if (state === "fried") {
            return "жареное";
        }

        return "сырое";
    }

    function formatNumber(value) {
        const rounded = Number(Number(value || 0).toFixed(1));

        if (Number.isInteger(rounded)) {
            return String(rounded);
        }

        return rounded.toFixed(1).replace(".", ",");
    }

    function getNutrition(row) {
        const product = row.product;

        if (!product || !product.raw) {
            return {
                calories: 0,
                protein: 0,
                fat: 0,
                carbs: 0
            };
        }

        const amount = Math.max(0, Number(row.amount || 0));
        let rawEquivalent = amount;

        if (
            row.state !== "raw" &&
            Number(product.cookedWeightRatio) > 0
        ) {
            rawEquivalent =
                amount / Number(product.cookedWeightRatio);
        }

        const multiplier = rawEquivalent / 100;

        const result = {
            calories: Number(product.raw.kcal || 0) * multiplier,
            protein: Number(product.raw.protein || 0) * multiplier,
            fat: Number(product.raw.fat || 0) * multiplier,
            carbs: Number(product.raw.carbs || 0) * multiplier
        };

        if (row.state === "fried") {
            const oilPer100 = Math.max(
                0,
                Number(oilInput ? oilInput.value : 0)
            );

            const oilAmount = amount * oilPer100 / 100;

            result.calories += oilAmount * 8.99;
            result.fat += oilAmount * 0.999;
        }

        return result;
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function updateProductList() {
        if (!productList) {
            return;
        }

        productList.innerHTML =
            Object.values(window.products || {})
                .map(
                    product =>
                        '<option value="' +
                        escapeHtml(product.name) +
                        '"></option>'
                )
                .join("");
    }

    function renderTotal() {
        const total = {
            calories: 0,
            protein: 0,
            fat: 0,
            carbs: 0
        };

        rows.forEach(row => {
            const nutrition = getNutrition(row);

            total.calories += nutrition.calories;
            total.protein += nutrition.protein;
            total.fat += nutrition.fat;
            total.carbs += nutrition.carbs;
        });

        if (totalCalories) {
            totalCalories.textContent =
                formatNumber(total.calories);
        }

        if (resultCalories) {
            resultCalories.textContent =
                formatNumber(total.calories);
        }

        if (resultProtein) {
            resultProtein.textContent =
                formatNumber(total.protein);
        }

        if (resultFat) {
            resultFat.textContent =
                formatNumber(total.fat);
        }

        if (resultCarbs) {
            resultCarbs.textContent =
                formatNumber(total.carbs);
        }
    }

    function renderRows() {
        if (!rows.length) {
            calculatorList.innerHTML =
                '<div class="nutrition-empty">' +
                    '<span>+</span>' +
                    '<p>Добавьте первый продукт, чтобы увидеть общий расчёт КБЖУ.</p>' +
                '</div>';

            renderTotal();
            return;
        }

        calculatorList.innerHTML =
            rows
                .map((row, index) => {
                    const nutrition = getNutrition(row);

                    return (
                        '<div class="nutrition-row" data-index="' +
                        index +
                        '">' +

                            '<div class="nutrition-row-product">' +
                                '<strong>' +
                                    escapeHtml(row.product.name) +
                                '</strong>' +
                                '<span>' +
                                    formatNumber(row.amount) +
                                    ' г · ' +
                                    getStateLabel(row.state) +
                                '</span>' +
                            '</div>' +

                            '<div class="nutrition-row-values">' +
                                '<span><strong>' +
                                    formatNumber(nutrition.calories) +
                                '</strong> ккал</span>' +
                                '<span><strong>' +
                                    formatNumber(nutrition.protein) +
                                '</strong> Б</span>' +
                                '<span><strong>' +
                                    formatNumber(nutrition.fat) +
                                '</strong> Ж</span>' +
                                '<span><strong>' +
                                    formatNumber(nutrition.carbs) +
                                '</strong> У</span>' +
                            '</div>' +

                            '<button class="nutrition-row-remove" type="button" ' +
                                'data-remove="' + index + '" ' +
                                'aria-label="Удалить продукт">×</button>' +

                        '</div>'
                    );
                })
                .join("");

        calculatorList
            .querySelectorAll(".nutrition-row-remove")
            .forEach(button => {
                button.addEventListener("click", () => {
                    rows.splice(
                        Number(button.dataset.remove),
                        1
                    );

                    renderRows();
                });
            });

        renderTotal();
    }

    function addProduct() {
        const found = findProduct(productInput.value);
        const amount = Number(amountInput.value);

        if (!found) {
            productInput.classList.add("nutrition-input-error");

            setTimeout(() => {
                productInput.classList.remove(
                    "nutrition-input-error"
                );
            }, 900);

            productInput.focus();
            return;
        }

        if (!Number.isFinite(amount) || amount <= 0) {
            amountInput.focus();
            return;
        }

        rows.push({
            productId: found.id,
            product: found.product,
            amount: amount,
            state: stateSelect.value
        });

        productInput.value = "";
        amountInput.value = "100";

        renderRows();
        productInput.focus();
    }

    addButton.addEventListener("click", addProduct);

    productInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            addProduct();
        }
    });

    stateSelect.addEventListener("change", () => {
        if (friedOptions) {
            friedOptions.hidden =
                stateSelect.value !== "fried";
        }
    });

    if (oilInput) {
        oilInput.addEventListener("input", renderRows);
    }

    updateProductList();
    renderRows();
});