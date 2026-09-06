import { BarChart } from '@godaddy/antares';
import { exoplanets as allExoplanets } from '@visx/mock-data';
import { RTLProvider } from '#utils/rtl-locale-provider.tsx';

interface ExoplanetSurveyPoint {
  name: string;
  value: number;
}

const trueExoplanets = allExoplanets.filter((d) => d.distance && d.distance > 0).slice(0, 60);
const categoryNames = trueExoplanets.slice(0, 15).map((d) => d.name);

function toSurveyData(planets: typeof trueExoplanets): ExoplanetSurveyPoint[] {
  return planets.slice(0, 15).map((d, i) => ({ name: categoryNames[i], value: d.radius }));
}

const series = [
  { id: 'survey-a', name: 'Survey A', data: toSurveyData(trueExoplanets.slice(0, 15)) },
  { id: 'survey-b', name: 'Survey B', data: toSurveyData(trueExoplanets.slice(15, 30)) },
  { id: 'survey-c', name: 'Survey C', data: toSurveyData(trueExoplanets.slice(30, 45)) },
  { id: 'survey-d', name: 'Survey D', data: toSurveyData(trueExoplanets.slice(45, 60)) }
];

/**
 * Horizontal grouped bars in a right-to-left layout: bars grow from the right edge and the category axis moves to the right side.
 * @title RTL horizontal multi-series
 * @order 8
 */
export function RTLHorizontalMultiSeriesExample(props: any) {
  return (
    <RTLProvider>
      <BarChart
        series={series}
        orientation="horizontal"
        xAccessor={(d: ExoplanetSurveyPoint) => d.value}
        yAccessor={(d: ExoplanetSurveyPoint) => d.name}
        xAxisTitle="Radius (Rj)"
        yAxisTitle="Exoplanet"
        xBaseline={true}
        yBaseline={true}
        xTickMarks={true}
        yTickMarks={true}
        yGridlines={true}
        xGridlines={true}
        {...props}
      />
    </RTLProvider>
  );
}
