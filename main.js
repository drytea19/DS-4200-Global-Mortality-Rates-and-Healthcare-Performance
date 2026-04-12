d3.csv("D3_data.csv").then(function(data) {

  // -----------------------------
  // Convert data types
  // -----------------------------
  data.forEach(d => {
    d.Spending = +d.Spending;
    d.LifeExpectancy = +d.LifeExpectancy;
    d.Year = +d.Year;
  });

  // Remove invalid values (log scale requirement)
  data = data.filter(d => d.Spending > 0 && d.LifeExpectancy > 0);

  // -----------------------------
  // SETUP
  // -----------------------------
  let width = 800,
      height = 500;

  let margin = {
    top: 40,
    bottom: 60,
    left: 70,
    right: 40
  };

  let svg = d3.select("svg")
              .attr("width", width)
              .attr("height", height);

  let tooltip = d3.select(".tooltip");

  // -----------------------------
  // SCALES
  // -----------------------------
  let xScale = d3.scaleLog()
                .domain([1, d3.max(data, d => d.Spending)])
                .range([margin.left, width - margin.right]);

  let yScale = d3.scaleLinear()
                .domain([
                  d3.min(data, d => d.LifeExpectancy) - 2,
                  d3.max(data, d => d.LifeExpectancy)
                ])
                .range([height - margin.bottom, margin.top]);

  // -----------------------------
  // AXES
  // -----------------------------
  svg.append("g")
     .call(d3.axisBottom(xScale).ticks(10, "~s"))
     .attr("transform", `translate(0, ${height - margin.bottom})`);

  svg.append("g")
     .call(d3.axisLeft(yScale))
     .attr("transform", `translate(${margin.left}, 0)`);

  // -----------------------------
  // LABELS
  // -----------------------------
  svg.append("text")
     .attr("x", width / 2)
     .attr("y", height - 10)
     .text("Healthcare Expenditure per Capita (log scale)")
     .style("text-anchor", "middle");

  svg.append("text")
     .attr("x", 0 - height / 2)
     .attr("y", 20)
     .text("Life Expectancy")
     .style("text-anchor", "middle")
     .attr("transform", "rotate(-90)");

  // -----------------------------
  // INITIAL DRAW (all years OR default year)
  // -----------------------------
  let year = 2021;

  let filtered = data.filter(d => d.Year === year);

  let circles = svg.selectAll("circle")
                   .data(filtered)
                   .enter()
                   .append("circle")
                   .attr("class", "point")
                   .attr("r", 5)
                   .attr("fill", "steelblue")
                   .attr("cx", d => xScale(d.Spending))
                   .attr("cy", d => yScale(d.LifeExpectancy))
                   .on("mouseover", function(event, d) {
                      tooltip.style("opacity", 1)
                        .html(
                          `<b>${d.Country}</b><br>
                           Spending: ${d.Spending}<br>
                           Life Expectancy: ${d.LifeExpectancy}`
                        )
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 20) + "px");
                   })
                   .on("mouseout", function() {
                      tooltip.style("opacity", 0);
                   });

  // -----------------------------
  // SLIDER UPDATE (simple re-draw style like example)
  // -----------------------------
  d3.select("#yearSlider").on("input", function() {

    let year = +this.value;
    d3.select("#yearLabel").text(year);

    let filtered = data.filter(d => d.Year === year);

    let circles = svg.selectAll("circle")
                     .data(filtered, d => d.Country);

    circles.exit().remove();

    circles.transition()
           .duration(300)
           .attr("cx", d => xScale(d.Spending))
           .attr("cy", d => yScale(d.LifeExpectancy));

    circles.enter()
           .append("circle")
           .attr("class", "point")
           .attr("r", 5)
           .attr("fill", "steelblue")
           .attr("cx", d => xScale(d.Spending))
           .attr("cy", d => yScale(d.LifeExpectancy))
           .on("mouseover", function(event, d) {
              tooltip.style("opacity", 1)
                .html(
                  `<b>${d.Country}</b><br>
                   Spending: ${d.Spending}<br>
                   Life Expectancy: ${d.LifeExpectancy}`
                )
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
           })
           .on("mouseout", function() {
              tooltip.style("opacity", 0);
           });

  });

});