# Sea Routes Visualization

## Description

Cargo Voyage Viewer is a single-page application designed to visualize sea routes.

https://github.com/petrgavrilov/cargo-voyage-viewer/assets/14808280/05e1021a-d53f-4134-b3be-6ced319af4ef

## Acknowledgements

This project was developed as a home assignment for Marcura Company. Here is a github repo with the original assignment: [github.com/Marcura/frontend-developer-test](https://github.com/Marcura/frontend-developer-test)

## Live Demo

Check out the live demo here: [Live Demo](https://petrgavrilov.github.io/cargo-voyage-viewer/)

## Features

### Easy Navigation

- Browse a full list of sea routes.
- Search and filter to quickly find routes.

<img width="600" alt="Easy Navigation" src="https://github.com/petrgavrilov/cargo-voyage-viewer/assets/14808280/7ae5ddbf-915e-496d-a509-de6594eaf9d7">

### Detailed Route Insights

- View key details: duration, distance, start/end dates, and ports.
- Observe vessel's speed changes on a chart.
- Access a table of all route points.
- See routes on a map with color-coded speeds.

<img width="600" alt="Detailed Route Insights" src="https://github.com/petrgavrilov/cargo-voyage-viewer/assets/14808280/897a6ee1-bd74-40a0-9c01-3dcfe2b1badc">

### Responsive Design

- Smooth experience on both mobile and desktop.

<img width="600" alt="Responsive Design" src="https://github.com/petrgavrilov/cargo-voyage-viewer/assets/14808280/4308fedc-cf65-483c-940c-8b505c14ee31">

## Installation

```bash
git clone https://github.com/petrgavrilov/cargo-voyage-viewer.git
cd cargo-voyage-viewer
npm install
npm start
```

Visit http://localhost:4200/ in your browser.

## Technologies Used

- [Angular](https://github.com/angular)
- [Angular Google Maps component](https://github.com/angular/components/tree/main/src/google-maps)
- [ngx-charts](https://github.com/swimlane/ngx-charts)

## Interesting Details

### Working with Google Maps

#### Visualizing routes with speed variation on Google Maps

For route visualization, `Polyline` is used to draw lines based on coordinates. Interestingly, the standard polyline doesn't support multiple colors because it's a single element. To overcome this, I created multiple polylines, each spanning two route points. This approach allows for individually colored segments. I created a helper function that converts the speed of a point to an RGB value, adjusting the intensity of the red and green channels based on the minimum, maximum, and current speed values.

```ts
export const calculateColor = (speed: number, minSpeed: number, maxSpeed: number): string => {
  // make sure the speed is within the bounds
  const clampedSpeed = Math.max(minSpeed, Math.min(speed, maxSpeed));
  // normalize the speed to a value between 0 and 1
  const normalizedSpeed = (clampedSpeed - minSpeed) / (maxSpeed - minSpeed);
  // red component is 255 when the speed is 0
  // and decreases as the speed increases
  const red = 255 * (1 - normalizedSpeed);
  // green component is 255 when the speed is max
  // and decreases as the speed decreases
  const green = 255 * normalizedSpeed;

  return `rgba(${red}, ${green}, 0)`;
};
```

Reference: [Google Map's Simple Polylines](https://developers.google.com/maps/documentation/javascript/examples/polyline-simple)

#### Optimally positioning the map

Positioning the map correctly to display the route was a challenge. It needed to be properly zoomed and centered, with an offset to accommodate a section of content on the right. The Google Maps API's `fitBounds` method with its padding parameter solved this elegantly, allowing the map to be automatically centered and adjusted within the bounds.

```ts
export const positionMap = (points: RoutePoint[]): void => {
  // create bounds based on route's points
  const bounds = new google.maps.LatLngBounds();
  points.forEach((point) => {
    bounds.extend(new google.maps.LatLng(point.latitude, point.longitude));
  });

  // provide paddings to avoid overlapping with page's content
  // content covers 400px on the right side of the page
  const paddings: google.maps.Padding = {
    left: 48,
    right: 448,
    top: 48,
    bottom: 48,
  };

  this.map?.fitBounds(bounds, paddings);
};
```

Reference: [fitBounds documentation](https://developers.google.com/maps/documentation/javascript/reference/map#Map.fitBounds)

### Winsorizing Speed Points

Some of the velocity data points were anomalously high. To mitigate these outliers, I applied a statistical technique called `winsorizing`. This technique adjusts extreme values to reduce their impact.

Here's an example code:

```ts
// limit extreme speed values
// by replacing them with the lower or upper bound
// to reduce the impact of outliers
export const winsorizePoints = (points: RoutePoint[]): RoutePoint[] => {
  const speedValues = points.map((point) => point.speed).filter((speed) => speed !== null) as number[];

  const sortedValues = speedValues.sort((a, b) => a - b);
  const lowerQuantile = getQuantile(sortedValues, 0.25);
  const upperQuantile = getQuantile(sortedValues, 0.75);
  const interQuartileRange = upperQuantile - lowerQuantile;

  const lowerBound = lowerQuantile - 1.5 * interQuartileRange;
  const upperBound = upperQuantile + 1.5 * interQuartileRange;

  return points.map((point) => {
    if (point.speed === null) {
      return point;
    }

    return {
      ...point,
      speed: Math.max(lowerBound, Math.min(upperBound, point.speed)),
    };
  });
};
```

Reference: [Winsorizing on Wikipedia](https://en.wikipedia.org/wiki/Winsorizing)

### Calculating the distance using the Haversine formula

The dataset contained coordinates for each point on the route. Using the `Haversine formula`, I calculated the total distance of the route to display to the user.

Here's an example code:

```ts
export const calculateTotalDistanceInKm = (points: RoutePoint[]): number => {
  const R = 6371; // Radius of the earth in km
  let totalDistance = 0;

  for (let i = 0; i < points.length - 1; i++) {
    let point1 = points[i];
    let point2 = points[i + 1];

    let dLat = deg2rad(point2.latitude - point1.latitude);
    let dLon = deg2rad(point2.longitude - point1.longitude);

    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(point1.latitude)) * Math.cos(deg2rad(point2.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c; // Distance in km
    totalDistance += distance;
  }

  return totalDistance;
};
```

Reference: [Haversine Formula on Wikipedia](https://en.wikipedia.org/wiki/Haversine_formula)

### Angular Built-in Pipes

Angular's built-in pipes were invaluable for data formatting in this application.

#### DecimalPipe

The DecimalPipe formats numeric values such as speed and weight. I used this pipe to standardize the display of values in the route point table, ensuring consistent alignment and decimal precision.

```html
<span class="table-cell">
  <!-- display value as 53.637016 -->
  {{ point.latitude | number : "2.6-6" }}
</span>

<span class="table-cell">
  <!-- display value as 11.20 -->
  {{ point.speed | number : "2.2-2" }}
</span>
```

Reference: [DecimalPipe documentation](https://angular.io/api/common/DecimalPipe)

#### DatePipe

This pipe provides inline date formatting capabilities.

```html
<span class="table-cell">
  <!-- display date as Jun 24 16:32:15 -->
  {{ point.timestamp | date : "MMM dd HH:mm:ss" }}
</span>
```

Reference: [DatePipe documentation](https://angular.io/api/common/DatePipe)

#### SlicePipe

Useful for creating slices of arrays directly in templates. I used it to limit the display of route points, with the limit set dynamically to show all points upon user interaction.

```html
<div *ngFor="let point of points | slice : 0 : pointsLimit">...</div>
```

Reference: [SlicePipe documentation](https://angular.io/api/common/SlicePipe)

## License

[MIT](LICENSE)

## Contact

For any feedback or questions, contact me at [petter426@gmail.com](mailto:petter426@gmail.com).
