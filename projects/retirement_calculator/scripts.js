function calculate_life_worth(age, interest_rate, net_worth, est_retirement_spending, monthly_savings, retire_age, dying_age) {
    var starting_year = (new Date()).getFullYear();
    var current_year = starting_year;
    var yearly_savings = monthly_savings * 12
    var est_retirement_spending = est_retirement_spending * 12
    var ages = [];
    var years = [];
    var worth = [];

    while (age < retire_age) {
        age += 1
        current_year += 1
        net_worth = net_worth + monthly_savings

        net_worth *= (1 + interest_rate)

        iteration = current_year - starting_year

        ages.push(age)
        worth.push(net_worth)
        years.push(current_year)

    }
    while (age < dying_age) {
        age += 1
        current_year += 1
        net_worth = net_worth - est_retirement_spending
        if (net_worth > 0) {
            net_worth *= (1 + interest_rate)
        }

        iteration = current_year - starting_year

        ages.push(age)
        worth.push(net_worth)
        years.push(current_year)

    }

    output_val = {
        "y_data": worth,
        "x_data": ages,
        "y_label": "worth",
        "x_label": "age"
    }
    return output_val
}

Number.prototype.formatMoney = function () {
    console.log("called format")
    var n = this,
        c = 2,
        d = ".",
        t = ",",
        a = "$",
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    var final = s + a + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    console.log("called format: " + n + " to: " + final)

    return final
};



function create_new_chart(labels, data, colours) {
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{ label: 'Net Worth', data: data, pointBackgroundColor: colours }]
        },
        options: {
            legend: { display: false },
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: { callback: function (value, index, values) { return value.toLocaleString("en-US", { style: "currency", currency: "USD" }); } },
                    scaleLabel: { display: true, labelString: 'Net Worth' }
                }],
                xAxes: [{
                    display: true,
                    scaleLabel: { display: true, labelString: 'age' },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10,
                        stepSize: 10
                    }
                }]
            },
        }
    });
};



function update_chart() {
    var age = parseFloat(age_input.value);
    var interest_rate = parseFloat(est_interest_rate_input.value);
    var net_worth = parseFloat(starting_wealth_input.value);

    dying_age_input.setAttribute("min", retire_age_input.value)
    var dying_age = Math.max(dying_age_input.value, retire_age_input.value)
    dying_age_input.value = dying_age

    retire_age_input.setAttribute("min", age_input.value)
    var retire_age = Math.max(age_input.value, retire_age_input.value)
    retire_age_input.value = retire_age

    var est_retirement_spending = parseFloat(est_retirement_spending_input.value);
    var monthly_savings = parseFloat(monthly_savings_input.value);

    est_retirement_spending_print.innerHTML = parseFloat(est_retirement_spending_input.value).toLocaleString("en-US", { style: "currency", currency: "USD" });
    monthly_savings_print.innerHTML = parseFloat(monthly_savings_input.value).toLocaleString("en-US", { style: "currency", currency: "USD" });
    retire_age_print.innerHTML = retire_age_input.value;
    dying_age_print.innerHTML = dying_age_input.value;


    var chart_vals = calculate_life_worth(age, interest_rate, net_worth, est_retirement_spending, monthly_savings, retire_age, dying_age)
    var data = chart_vals["y_data"]
    var labels = chart_vals["x_data"]
    var colours = data.map((value) => value < 0 ? 'red' : '#4CAF50');

    var max_wealth = Math.max(...data)
    var last_wealth = data[data.length - 1]

    net_worth_peak_span.innerHTML = (max_wealth).toLocaleString("en-US", { style: "currency", currency: "USD" });
    after_life_worth_span.innerHTML = (last_wealth).toLocaleString("en-US", { style: "currency", currency: "USD" });
    if (last_wealth > 0) {
        afterlife_savings_text_span.innerHTML = "afterlife savings"
    } else {
        afterlife_savings_text_span.innerHTML = "afterlife debt"
    }
    var currentWindowWidth = Math.min(window.innerWidth, 1000);
    var currentWindowHeight = Math.min(window.innerHeight, 1000);

    myChart.destroy()
    create_new_chart(labels, data, colours)
    ctx.width = currentWindowWidth;
    ctx.height = currentWindowHeight;
    myChart.resize()
}

