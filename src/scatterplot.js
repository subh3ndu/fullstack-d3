import * as d3 from 'd3';

export function drawScatter(data) {
  //#region 1. Access Data
  const xAccessor = d => d['dewPoint'];
  const yAccessor = d => d['humidity'];
  const colorAccessor = d => d['cloudCover']
  //#endregion

  //#region 2. Create Chart Dimensions
  const width = d3.min([
    window.innerWidth * 0.9,
    window.innerHeight * 0.9
  ]);
  const dimensions = {
    width,
    height: width,
    margins: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 60,
    }
  }
  dimensions.boundedWidth = dimensions.width 
    - dimensions.margins.left 
    - dimensions.margins.right;
  dimensions.boundedHeight = dimensions.height 
    - dimensions.margins.top 
    - dimensions.margins.bottom;
  //#endregion

  //#region 3. Draw Canvas
  const wrapper = d3.select('#app')
    .append('svg')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)

  const bounds = wrapper
    .append('g')
      .style('transform', `translate(${
        dimensions.margins.left
      }px, ${
        dimensions.margins.top
      }px)`);
  //#endregion

  //#region 4. Create Scales
  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  const colorScale = d3.scaleLinear()
    .domain(d3.extent(data, colorAccessor))
    .range(['white', 'cornflowerblue'])
  //#endregion

  //#region 5. Draw Data 
  const marksData = data.map((d) => ({
    x: xScale(xAccessor(d)),
    y: yScale(yAccessor(d)),
    fill: colorScale(colorAccessor(d)),
  }))

  const marks = bounds.selectAll('circle#mark')
    .data(marksData)
    .join('circle')
      .attr('id', 'mark')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 3)
      .style('fill', d => d.fill);
  //#endregion

  //#region 6. Draw Peripherals
  const xAxisGenerator = d3
    .axisBottom()
    .scale(xScale);
  const xAxis = bounds
    .append('g')
      .style('transform', `translateY(${dimensions.boundedHeight}px)`)
      .call(xAxisGenerator);
  const xAxisLabel = xAxis
    .append('text')
    .attr('x', dimensions.boundedWidth / 2)
    .attr('y', dimensions.margins.bottom - 10)
    .attr('fill', 'black')
    .style('font-size', '1.4em')
    .html('Dew Point (&deg;F)')

  const yAxisGenerator = d3
    .axisLeft()
    .scale(yScale)
    .ticks(4);
  const yAxis = bounds
    .append('g')
    .call(yAxisGenerator);
  const yAxisLabel = yAxis 
    .append('text')
    .attr('x', -dimensions.boundedHeight / 2)
    .attr('y', -dimensions.margins.left + 20)
    .attr('fill', 'black')
    .text('Relative Humidity')
    .style('transform', 'rotate(-90deg)')
    .style('text-anchor', 'middle')
    .style('font-size', '1.4em')
  //#endregion

  //#region 7. Extras:

  //#endregion
}