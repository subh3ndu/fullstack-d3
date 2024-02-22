import * as d3 from 'd3';

async function createEvent() {
  const rectColors = [
    'yellowgreen',
    'cornflowerblue',
    'seagreen',
    'slateblue',
  ]

  const rects = d3.select('#svg')
    .append('svg')
      .attr('width', window.innerWidth)
      .attr('height', window.innerHeight)
    .selectAll('.rect')
    .data(rectColors)
    .join('rect')
      .attr('width', 100)
      .attr('height', 100)
      .attr('x', (d, i) => i * 110)
      .attr('y', 10)
      .attr('fill', 'lightGray')

  rects.on('mouseenter', (e, d) => {
    const selection = d3.select(e.currentTarget);
    selection.attr('fill', d => d)
  })

  rects.on('mouseleave', (e, d) => {
    const selection = d3.select(e.currentTarget)
    selection.attr('fill', 'lightGray')
  })

  setTimeout(() => {
    console.log('hi')

    rects.dispatch('mouseleave')

    rects.on('mouseenter', null);
    rects.on('mouseleave', null);

  }, 3000);
}

createEvent();