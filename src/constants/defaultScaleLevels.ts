export type ScaleLevel = {
  scale: number; // in seconds
  timeInterval: number; // in seconds
  framePerMarker: number;
  markersBetweenInterval: number; // interval marker not included
};

const scaleLevels: ScaleLevel[] = [
  {
    scale: 1,
    framePerMarker: 500,
    timeInterval: 300,
    markersBetweenInterval: 14,
  },
  {
    scale: 2,
    framePerMarker: 125,
    timeInterval: 60,
    markersBetweenInterval: 11,
  },
  {
    scale: 3,
    framePerMarker: 50,
    timeInterval: 30,
    markersBetweenInterval: 14,
  },
  {
    scale: 4,
    framePerMarker: 25,
    timeInterval: 15,
    markersBetweenInterval: 14,
  },
  {
    scale: 5,
    framePerMarker: 12.5,
    timeInterval: 5,
    markersBetweenInterval: 9,
  },
  {
    scale: 6,
    framePerMarker: 12.5,
    timeInterval: 5,
    markersBetweenInterval: 9,
  },
  {
    scale: 7,
    framePerMarker: 12.5,
    timeInterval: 2.5,
    markersBetweenInterval: 4,
  },
  {
    scale: 8,
    framePerMarker: 5,
    timeInterval: 1,
    markersBetweenInterval: 4,
  },
  {
    scale: 9,
    framePerMarker: 5,
    timeInterval: 1,
    markersBetweenInterval: 4,
  },
  {
    scale: 10,
    framePerMarker: 2.5,
    timeInterval: 0.5,
    markersBetweenInterval: 4,
  },
  {
    scale: 11,
    framePerMarker: 1,
    timeInterval: 0.2, // 5 frame
    markersBetweenInterval: 4,
  },
  {
    scale: 12,
    framePerMarker: 1,
    timeInterval: 0.2, //5 frame
    markersBetweenInterval: 4,
  },
];

export default scaleLevels;
