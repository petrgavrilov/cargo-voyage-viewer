# Sea Route Visualization with Angular and Google Maps

## Description

CargoVoyageViewer is a single-page application designed to visualize sea routes.

https://github.com/petrgavrilov/cargo-voyage-viewer/assets/14808280/05e1021a-d53f-4134-b3be-6ced319af4ef

## Acknowledgements

This project was developed as a home assignment for Marcura Company. Here is a github repo with the original assignment: [github.com/Marcura/frontend-developer-test](https://github.com/Marcura/frontend-developer-test)

## Live Demo

Check out the live demo here: [Live Demo](https://petrgavrilov.github.io/cargo-voyage-viewer/)

## Features

### Easy Navigation

- Browse a full list of sea routes.
- Search and filter to quickly find routes.

### Detailed Route Insights

- View key details: duration, distance, start/end dates, and ports.
- Observe vessel's speed changes on a chart.
- Access a table of all route points.
- See routes on a map with color-coded speeds.

### Responsive Design

- Smooth experience on both mobile and desktop.

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

### How to Display Route on Google Map

Detailed explanation of how the application integrates with Google Maps to display selected sea routes.

### How to Color Google Map Polyline with Different Colors

Discussion on the implementation of color-coded polylines to represent different speeds.

### How to Style Google Map

Techniques used to customize the look and feel of Google Maps within the application.

### How to Visualize Vessel's Speed with Google Map

Explanation of the method used to visually represent the vessel's speed on the map.

### How to Winsorize Speed for Proper Visualization

Insights into data preprocessing for effective visualization, focusing on the winsorization technique.

### How to Calculate Distance Based on Points with Coordinates (Haversine formula)

Elaboration on the use of the Haversine formula to calculate distances between geographic coordinates.

### How Distance is Measured in Marine Traffic

Information on how distances are calculated and represented in the context of marine traffic.

### How to Bounce Map and Add Paddings to Avoid Overlapping with Content

Techniques used to enhance the user interface and experience by adjusting map bounds and padding.

### Useful Angular Built-in Pipes for Data Formatting

Sharing knowledge on how Angular's built-in pipes were utilized for efficient data formatting.

## License

[MIT](LICENSE)

## Contact

For any feedback or questions, contact me at [petter426@gmail.com](mailto:petter426@gmail.com).
