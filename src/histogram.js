import * as d3 from 'd3';

export function drawBars(dataset, metrics) {
  //#region 1. Access data
  // const dataset = await d3.json("./my_weather_data.json")

  const metricAccessor = d => d[metrics]
  const yAccessor = d => d.length
  //#endregion

  //#region 2. Create chart dimensions
  const width = 600
  let dimensions = {
    width: width,
    height: width * 0.6,
    margin: {
      top: 30,
      right: 30,
      bottom: 50,
      left: 50,
    },
  }
  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom
  //#endregion

  //#region 3. Draw canvas
  const wrapper = d3.select('#app')
    .style('position', 'relative')
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
      .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`)
  //#endregion

  //#region 4. Create scales
  const xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, metricAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  const binsGenerator = d3.bin()
    .domain(xScale.domain())
    .value(metricAccessor)
    .thresholds(12)

  const bins = binsGenerator(dataset)

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(bins, yAccessor)])
    .range([dimensions.boundedHeight, 0])
    .nice()
  //#endregion

  //#region 5. Draw data
  const binsGroup = bounds.append("g")

  const binGroups = binsGroup.selectAll("g")
    .data(bins)
    .join("g")

  const barPadding = 1
  const barRects = binGroups
      .attr('class', 'bin')
      .append("rect")
      .attr("x", d => xScale(d.x0) + barPadding / 2)
      .attr("y", d => yScale(yAccessor(d)))
      .attr("width", d => d3.max([
        0,
        xScale(d.x1) - xScale(d.x0) - barPadding
      ]))
      .attr("height", d => dimensions.boundedHeight
        - yScale(yAccessor(d))
      )
      
  const barText = binGroups.filter(yAccessor)
    .append("text")
      .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
      .attr("y", d => yScale(yAccessor(d)) - 5)
      .text(yAccessor)
      .style("text-anchor", "middle")
      .attr("fill", "darkgrey")
      .style("font-size", "12px")
      .style("font-family", "sans-serif")

  const mean = d3.mean(dataset, metricAccessor)
  const meanLine = bounds.append("line")
      .attr("x1", xScale(mean))
      .attr("x2", xScale(mean))
      .attr("y1", -15)
      .attr("y2", dimensions.boundedHeight)
      .attr("stroke", "maroon")
      .attr("stroke-dasharray", "2px 4px")

  const meanLabel = bounds.append("text")
      .attr("x", xScale(mean))
      .attr("y", -20)
      .text("mean")
      .attr("fill", "maroon")
      .style("font-size", "12px")
      .style("text-anchor", "middle")
  //#endregion

  //#region 6. Draw peripherals
  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)

  const xAxisLabel = xAxis.append("text")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margin.bottom - 10)
      .attr("fill", "black")
      .style("font-size", "1.4em")
      .text(metrics)
      .style("text-transform", "capitalize")
  //#endregion

  //#region 7. Create interactions
  const tooltip = d3.select('#app')
    .append('div')
      .attr('class', 'tooltip');

  tooltip
    .append('div')
    .attr('id', 'tooltip-header')
    .style('margin-bottom', '0.2em')
    .style('font-weight', '600');

  tooltip
    .append('div')
    .attr('id', 'tooltip-body');

  binGroups
    .on('mouseenter', onMouseEnter)
    .on('mouseleave', onMouseLeave);

  function onMouseEnter(event, d) {
    tooltip.style('opacity', 1)
    tooltip.select('#tooltip-header').text(`${metrics.charAt(0).toUpperCase() + metrics.slice(1)}: ${[d.x0, d.x1].join(' - ')}`)
    tooltip.select('#tooltip-body').text(`${d.length} days`)

    const x = xScale(d.x0) + barPadding * 2 
      + (xScale(d.x1) - xScale(d.x0)) / 2 
      + dimensions.margin.left;
    const y = yScale(yAccessor(d)) 
      + dimensions.margin.top;

    const p = xScale(d.x0) + barPadding * 2
      + (xScale(d.x1) - xScale(d.x0)) / 2
    

    tooltip.style('transform', `translate(
      calc(-50% + ${x}px),
      calc(-100% + ${y}px)
    )`)
  }

  function onMouseLeave(event, d) {
    tooltip.style('opacity', 0)
  }

  //#endregion
}