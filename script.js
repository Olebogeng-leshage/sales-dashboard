// ===============================
// South Africa Sales Dashboard
// ===============================

const salesTable = document.getElementById("salesTable");
const totalRevenue = document.getElementById("totalRevenue");
const totalProfit = document.getElementById("totalProfit");
const totalOrders = document.getElementById("totalOrders");
const totalCustomers = document.getElementById("totalCustomers");
const bestSeller = document.getElementById("bestSeller");
const topProvince = document.getElementById("topProvince");
const searchInput = document.getElementById("searchInput");

let revenueChart;
let categoryChart;
let provinceChart;

// Format Rand
function formatRand(value){
    return "R" + value.toLocaleString("en-ZA");
}

// -------------------------
// Populate Table
// -------------------------

function displaySales(data){

    salesTable.innerHTML = "";

    data.forEach(item=>{

        salesTable.innerHTML += `
        <tr>
            <td>${item.product}</td>
            <td>${item.category}</td>
            <td>${item.province}</td>
            <td>${item.orders}</td>
            <td>${formatRand(item.revenue)}</td>
            <td>${formatRand(item.profit)}</td>
        </tr>
        `;

    });

}

// -------------------------
// Dashboard Cards
// -------------------------

function updateDashboard(){

    const revenue =
        salesData.reduce((sum,item)=>sum+item.revenue,0);

    const profit =
        salesData.reduce((sum,item)=>sum+item.profit,0);

    const orders =
        salesData.reduce((sum,item)=>sum+item.orders,0);

    const customers =
        salesData.reduce((sum,item)=>sum+item.customers,0);

    totalRevenue.textContent = formatRand(revenue);
    totalProfit.textContent = formatRand(profit);
    totalOrders.textContent = orders;
    totalCustomers.textContent = customers;

    let highestOrders = 0;
    let bestProduct = "";

    salesData.forEach(item=>{

        if(item.orders > highestOrders){

            highestOrders = item.orders;
            bestProduct = item.product;

        }

    });

    bestSeller.textContent = bestProduct;

    // Province totals

    const provinceTotals = {};

    salesData.forEach(item=>{

        provinceTotals[item.province] =
            (provinceTotals[item.province] || 0) +
            item.revenue;

    });

    let provinceName = "";
    let provinceRevenue = 0;

    for(let province in provinceTotals){

        if(provinceTotals[province] > provinceRevenue){

            provinceRevenue = provinceTotals[province];
            provinceName = province;

        }

    }

    topProvince.textContent = provinceName;

}

// -------------------------
// Search
// -------------------------

searchInput.addEventListener("keyup",function(){

    const search =
        this.value.toLowerCase();

    const filtered =
        salesData.filter(item=>

            item.product.toLowerCase().includes(search)

        );

    displaySales(filtered);

});

// -------------------------
// Charts
// -------------------------

function createCharts(){

    // Destroy existing charts

    if(revenueChart) revenueChart.destroy();
    if(categoryChart) categoryChart.destroy();
    if(provinceChart) provinceChart.destroy();

    // Revenue by Product

    revenueChart = new Chart(

        document.getElementById("revenueChart"),

        {

            type:"bar",

            data:{

                labels:salesData.map(item=>item.product),

                datasets:[{

                    label:"Revenue (R)",

                    data:salesData.map(item=>item.revenue)

                }]

            },

            options:{

                responsive:true

            }

        }

    );

    // Category Chart

    const categories = {};

    salesData.forEach(item=>{

        categories[item.category] =
            (categories[item.category]||0)+
            item.revenue;

    });

    categoryChart = new Chart(

        document.getElementById("categoryChart"),

        {

            type:"pie",

            data:{

                labels:Object.keys(categories),

                datasets:[{

                    data:Object.values(categories)

                }]

            }

        }

    );

    // Province Chart

    const provinces = {};

    salesData.forEach(item=>{

        provinces[item.province] =
            (provinces[item.province]||0)+
            item.revenue;

    });

    provinceChart = new Chart(

        document.getElementById("provinceChart"),

        {

            type:"bar",

            data:{

                labels:Object.keys(provinces),

                datasets:[{

                    label:"Revenue by Province",

                    data:Object.values(provinces)

                }]

            },

            options:{

                responsive:true

            }

        }

    );

}

// -------------------------
// Start Dashboard
// -------------------------

displaySales(salesData);

updateDashboard();

createCharts();
