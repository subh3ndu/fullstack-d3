import * as d3 from 'd3';

export const getWeatherDataAsync = async () => 
  await d3.json('./my_weather_data.json')