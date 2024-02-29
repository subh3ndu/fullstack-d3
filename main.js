import { getWeatherDataAsync } from "./data";
import { drawBars } from "./src/histogram";
import { drawLine } from "./src/linechart";
import { drawScatter } from "./src/scatterplot";

const data = await getWeatherDataAsync();
