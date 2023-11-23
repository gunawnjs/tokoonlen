const USD_TO_RUPIAH_EXCHANGE_RATE = 15000;
const btnFilter = document.getElementById('btnFilter');
const btnSearch = document.getElementById('btnSearch');
const filterFeature = document.querySelector('.filter-product');

async function fetchData() {
    const response = await fetch('https://dummyjson.com/products');
    const jsonData = await response.json();
    return jsonData.products;
}

function calculateDiscountedPrice(product) {
    const discountPercentage = Math.round(product.discountPercentage);
    const originalPrice = product.price * USD_TO_RUPIAH_EXCHANGE_RATE;
    const discountedPrice = (100 - discountPercentage) / 100 * originalPrice;
    return Math.round(discountedPrice * 100) / 100;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat(["ban", "id"]).format(amount);
}

function generateProductCard(product) {
    const discountedPriceRp = formatCurrency(calculateDiscountedPrice(product));
    const originalPriceRp = formatCurrency(product.price * USD_TO_RUPIAH_EXCHANGE_RATE);

    return `<div class="card-item">
        <img src="${product.thumbnail}" alt="img-prod">
        <div class="detail-product">
            <h1 class="name">${product.title}</h1>
            <h2 class="disc-price">Rp ${discountedPriceRp}</h2>
            <div class="container">
                <h2 class="ori-price">Rp ${originalPriceRp}</h2>
                <p class="disc-percentage">${Math.round(product.discountPercentage)} %</p>
            </div>
            <div class="container">
                <div class="wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                    <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                </svg>
                    <p>${product.rating}<p>
                </div>
                <span>•</span>
                <div class="wrapper">
                    <p>stok</p>
                    <p>${product.stock}<p>
                </div>
            </div>
        </div>
    </div>`;
}

document.addEventListener('DOMContentLoaded', async () => {
    await filterProductOptions();
    await showData();
});

async function filterProductOptions() {
    const data = await fetchData();
    const container = document.getElementById('filterProd');
    const uniqueCategories = new Set(data.map(product => product.category));

    container.innerHTML = '';
    container.innerHTML += `<option value="">Select Category</option>`;

    uniqueCategories.forEach(category => {
        const formattedCategory = category.replace(/-/g, ' ').replace(/\b\w/g, firstChar => firstChar.toUpperCase());
        container.innerHTML += `<option value="${category}">${formattedCategory}</option>`;
    });
}

async function filterProduct(category) {
    const data = await fetchData();
    return data.filter(product => product.category === category);
}

async function showData() {
    const container = document.querySelector('.all-item');
    const filterContainer = document.getElementById('filterProd');

    container.innerHTML = '';

    const selectedCategory = filterContainer.value;
    const filteredData = selectedCategory ? await filterProduct(selectedCategory) : await fetchData();

    for (const product of filteredData) {
        container.innerHTML += generateProductCard(product);
    }
}

btnFilter.addEventListener('click', (event) => {
    event.stopPropagation();
    filterFeature.classList.toggle('show');
})

document.addEventListener('click', (event) => {
    const isClickInsideFilter = filterFeature.contains(event.target);
    const isClickOnFilterButton = btnFilter.contains(event.target);

    if (!isClickInsideFilter && !isClickOnFilterButton) {
        filterFeature.classList.remove('show');
    }
})


const filterContainer = document.getElementById('filterProd');
filterContainer.addEventListener('change', showData);
