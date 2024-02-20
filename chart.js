import * as d3 from 'd3';

async function drawLineChart() {
  // Data & Accessors
  const data = await d3.json('/my_weather_data.json');

  const parseDate = d3.timeParse('%Y-%m-%d');
  const yAccessor = d => d['temperatureMax'];
  const xAccessor = d => parseDate(d['date']);

  // Create Chart Dimensions
  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margins: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60
    },
  };

  dimensions.boundedWidth = dimensions.width - dimensions.margins.left - dimensions.margins.right;
  dimensions.boundedHeight = dimensions.height - dimensions.margins.top - dimensions.margins.bottom;

  const wrapper = d3.select('#wrapper')
    .append('svg')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

  const bounds = wrapper
    .append('g')
      .style('transform', `translate(${
        dimensions.margins.left
      }px, ${
        dimensions.margins.top
      }px)`);

  // Create Scales
  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([dimensions.boundedHeight, 0]);

  const freezingTemperaturePlacement = yScale(32);
  const freezingTemperatures = bounds
    .append('rect')
      .attr('width', dimensions.boundedWidth)
      .attr('height', dimensions.boundedHeight - freezingTemperaturePlacement)
      .attr('x', 0)
      .attr('y', freezingTemperaturePlacement)
      .attr('fill', '#e0f3f3')

  const xScale = d3.scaleTime()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth]);

  // Draw data
  const lineGenerator = d3.line()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)));

  const line = bounds.append('path')
    .attr('d', lineGenerator(data))
    .attr('fill', 'none')
    .attr('stroke', '#af9358')
    .attr('stroke-width', 2)

  // Draw Peripherals
  const yAxisGenerator = d3.axisLeft().scale(yScale);
  const xAxisGenerator = d3.axisBottom().scale(xScale);
  
  const yAxis = bounds.append('g').call(yAxisGenerator);
  const xAxis = bounds
    .append('g')
    .style('transform', `translateY(${dimensions.boundedHeight}px)`)
    .call(xAxisGenerator);
}

async function drawScatterPlot() {
  //#region 1. Access Data
  const data = await d3.json('/my_weather_data.json');

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
  const wrapper = d3.select('#wrapper')
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
    .range(['skyblue', 'darkslategray'])
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

drawScatterPlot();