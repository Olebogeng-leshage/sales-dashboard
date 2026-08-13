let currentData = [...salesData];

let monthlyChart;
let categoryChart;
let provinceChart;
let productChart;


/* =========================
   FORMAT RAND
========================= */

function rand(value){

return "R" + Number(value).toLocaleString("en-ZA");

}


/* =========================
   POPULATE FILTERS
========================= */

function populateFilters(){

const provinces = [...new Set(
salesData.map(item=>item.province)
)];

const categories = [...new Set(
salesData.map(item=>item.category)
)];

const months = [...new Set(
salesData.map(item=>item.month)
)];


const provinceFilter =
document.getElementById("provinceFilter");

const categoryFilter =
document.getElementById("categoryFilter");

const monthFilter =
document.getElementById("monthFilter");


provinces.forEach(province=>{

provinceFilter.innerHTML +=
`<option value="${province}">
${province}
</option>`;

});


categories.forEach(category=>{

categoryFilter.innerHTML +=
`<option value="${category}">
${category}
</option>`;

});


months.forEach(month=>{

monthFilter.innerHTML +=
`<option value="${month}">
${month}
</option>`;

});

}


/* =========================
   UPDATE DASHBOARD
========================= */

function updateDashboard(data){

currentData = data;


let revenue = 0;
let profit = 0;
let orders = 0;
let customers = 0;


data.forEach(item=>{

revenue += item.revenue;
profit += item.profit;
orders += item.orders;
customers += item.customers;

});


document.getElementById("totalRevenue")
.textContent = rand(revenue);


document.getElementById("totalProfit")
.textContent = rand(profit);


document.getElementById("totalOrders")
.textContent =
orders.toLocaleString();


document.getElementById("totalCustomers")
.textContent =
customers.toLocaleString();


document.getElementById("revenueGrowth")
.textContent =
"▲ 12.5%";


document.getElementById("profitGrowth")
.textContent =
"▲ 9.8%";


document.getElementById("ordersGrowth")
.textContent =
"▲ 7.4%";


displayTable(data);

createCharts(data);

createTopProducts(data);

generateInsights(data);

}


/* =========================
   TABLE
========================= */

function displayTable(data){

const table =
document.getElementById("salesTable");

table.innerHTML = "";


data.forEach(item=>{

table.innerHTML += `

<tr>

<td>${item.product}</td>

<td>${item.category}</td>

<td>${item.province}</td>

<td>${item.month}</td>

<td>${item.orders}</td>

<td>${rand(item.revenue)}</td>

<td>${rand(item.profit)}</td>

</tr>

`;

});

}


/* =========================
   FILTERS
========================= */

function filterData(){

const search =
document.getElementById("searchInput")
.value.toLowerCase();


const province =
document.getElementById("provinceFilter")
.value;


const category =
document.getElementById("categoryFilter")
.value;


const month =
document.getElementById("monthFilter")
.value;


const filtered = salesData.filter(item=>{

const matchesSearch =
item.product.toLowerCase()
.includes(search);


const matchesProvince =
province === "all" ||
item.province === province;


const matchesCategory =
category === "all" ||
item.category === category;


const matchesMonth =
month === "all" ||
item.month === month;


return matchesSearch &&
matchesProvince &&
matchesCategory &&
matchesMonth;

});


updateDashboard(filtered);

}


/* =========================
   CHARTS
========================= */

function createCharts(data){


if(monthlyChart)
monthlyChart.destroy();


if(categoryChart)
categoryChart.destroy();


if(provinceChart)
provinceChart.destroy();


if(productChart)
productChart.destroy();


/* MONTHLY */

const monthly = {};


data.forEach(item=>{

monthly[item.month] =
(monthly[item.month] || 0)
+ item.revenue;

});


monthlyChart =
new Chart(

document.getElementById("monthlyChart"),

{

type:"line",

data:{

labels:Object.keys(monthly),

datasets:[{

label:"Revenue (R)",

data:Object.values(monthly),

fill:false,

tension:.3

}]

},

options:{

responsive:true

}

}

);


/* CATEGORY */

const categories = {};


data.forEach(item=>{

categories[item.category] =
(categories[item.category] || 0)
+ item.revenue;

});


categoryChart =
new Chart(

document.getElementById("categoryChart"),

{

type:"doughnut",

data:{

labels:Object.keys(categories),

datasets:[{

data:Object.values(categories)

}]

},

options:{

responsive:true

}

}

);


/* PROVINCE */

const provinces = {};


data.forEach(item=>{

provinces[item.province] =
(provinces[item.province] || 0)
+ item.revenue;

});


provinceChart =
new Chart(

document.getElementById("provinceChart"),

{

type:"bar",

data:{

labels:Object.keys(provinces),

datasets:[{

label:"Revenue (R)",

data:Object.values(provinces)

}]

},

options:{

responsive:true

}

}

);


/* PRODUCTS */

const products = {};


data.forEach(item=>{

products[item.product] =
(products[item.product] || 0)
+ item.revenue;

});


productChart =
new Chart(

document.getElementById("productChart"),

{

type:"bar",

data:{

labels:Object.keys(products),

datasets:[{

label:"Revenue (R)",

data:Object.values(products)

}]

},

options:{

responsive:true

}

}

);

}


/* =========================
   TOP PRODUCTS
========================= */

function createTopProducts(data){

const products = {};


data.forEach(item=>{

products[item.product] =
(products[item.product] || 0)
+ item.revenue;

});


const ranking =
Object.entries(products)
.sort((a,b)=>b[1]-a[1])
.slice(0,5);


const container =
document.getElementById("topProducts");

container.innerHTML = "";


ranking.forEach((item,index)=>{

container.innerHTML += `

<div class="top-product">

<span class="rank">
#${index+1}
</span>

<span class="product-name">
${item[0]}
</span>

<span class="product-value">
${rand(item[1])}
</span>

</div>

`;

});

}


/* =========================
   AUTOMATIC INSIGHTS
========================= */

function generateInsights(data){

const container =
document.getElementById("insights");

container.innerHTML = "";


if(data.length === 0){

container.innerHTML =
`<div class="insight">
No data matches your filters.
</div>`;

return;

}


/* BEST PRODUCT */

const products = {};


data.forEach(item=>{

products[item.product] =
(products[item.product] || 0)
+ item.revenue;

});


const bestProduct =
Object.entries(products)
.sort((a,b)=>b[1]-a[1])[0];


/* BEST PROVINCE */

const provinces = {};


data.forEach(item=>{

provinces[item.province] =
(provinces[item.province] || 0)
+ item.revenue;

});


const bestProvince =
Object.entries(provinces)
.sort((a,b)=>b[1]-a[1])[0];


/* BEST CATEGORY */

const categories = {};


data.forEach(item=>{

categories[item.category] =
(categories[item.category] || 0)
+ item.revenue;

});


const bestCategory =
Object.entries(categories)
.sort((a,b)=>b[1]-a[1])[0];


container.innerHTML += `

<div class="insight">

🏆 <strong>${bestProduct[0]}</strong>
is the highest-revenue product with
<strong>${rand(bestProduct[1])}</strong>.

</div>

`;


container.innerHTML += `

<div class="insight">

📍 <strong>${bestProvince[0]}</strong>
is the strongest province with
<strong>${rand(bestProvince[1])}</strong>
in revenue.

</div>

`;


container.innerHTML += `

<div class="insight">

📊 <strong>${bestCategory[0]}</strong>
is the highest-performing category.

</div>

`;

}


/* =========================
   CSV EXPORT
========================= */

function downloadCSV(){

let csv =
"Product,Category,Province,Month,Orders,Revenue,Profit\n";


currentData.forEach(item=>{

csv +=

`"${item.product}","${item.category}","${item.province}","${item.month}",${item.orders},${item.revenue},${item.profit}\n`;

});


const blob =
new Blob([csv],{type:"text/csv"});


const url =
URL.createObjectURL(blob);


const link =
document.createElement("a");


link.href = url;

link.download =
"SA-sales-report.csv";


link.click();


URL.revokeObjectURL(url);

}


/* =========================
   DARK MODE
========================= */

document
.getElementById("themeButton")
.addEventListener("click",()=>{

document.body
.classList.toggle("dark-mode");


const button =
document.getElementById("themeButton");


button.textContent =
document.body.classList.contains("dark-mode")
? "☀️"
: "🌙";

});


/* =========================
   EVENTS
========================= */

document
.getElementById("searchInput")
.addEventListener(
"input",
filterData
);


document
.getElementById("provinceFilter")
.addEventListener(
"change",
filterData
);


document
.getElementById("categoryFilter")
.addEventListener(
"change",
filterData
);


document
.getElementById("monthFilter")
.addEventListener(
"change",
filterData
);


document
.getElementById("downloadButton")
.addEventListener(
"click",
downloadCSV
);


/* =========================
   START
========================= */

populateFilters();

updateDashboard(salesData);
