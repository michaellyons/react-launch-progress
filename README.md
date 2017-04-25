# React Launch Timeline

### Inspired by SpaceX's clean display for event sequences.

[![PeerDependencies](https://img.shields.io/david/peer/michaellyons/react-launch-timeline.svg?style=flat-square)](https://david-dm.org/michaellyons/react-launch-timeline#info=peerDependencies&view=list)
[![Dependencies](https://img.shields.io/david/michaellyons/react-launch-timeline.svg?style=flat-square)](https://david-dm.org/michaellyons/react-launch-timeline)
[![DevDependencies](https://img.shields.io/david/dev/michaellyons/react-launch-timeline.svg?style=flat-square)](https://david-dm.org/michaellyons/react-launch-timeline#info=devDependencies&view=list)

## [Github Page](https://michaellyons.github.io/react-launch-timeline)

## Prerequisites

You should be using [NodeJS](https://www.nodejs.org) and [ReactJS](https://facebook.github.io/react/)

## Installation

React Launch Timeline is available as an [npm package](https://www.npmjs.org/package/react-launch-timeline).
```sh
npm install react-launch-timeline [-S]
```
or

```sh
yarn add react-launch-timeline
```

## Usage

Using React Launch Timeline is very straightforward. Once it is included in your project, you can use the components this way:

```js
import React from 'react';
import Timeline from 'react-launch-timeline';

let dates = [
  {
    name: 'Prep',
    date: '2017-04-23',
    onComplete: () => { console.log("Prep is done!"); }
  },
  {
    name: 'Startup',
    date: '2017-04-24',
    onComplete: () => { console.log("Startup is done!"); }
  },
  {
    name: 'Launch',
    date: '2017-04-25',
    onComplete: () => { console.log("Launch is done!"); }
  },
  ...
];

const MyAwesomeReactComponent = () => (
  <Timeline data={dates} />
);

export default MyAwesomeReactComponent;
```

## Customization

Key | Required | Type | Description
----- | ----- |  ----- | -----
data | Y | Object[] | Objects with date key and name for labels.
height | | Integer/String | This will set the total height of the chart.
labelPos | | Enum | This will set the total height of the chart.
xData | | String | Optional override date key for data objects.
onComplete | | Function | Function to call when timeline reaches end.
utc | | Bool | Sets parse format to UTC
timed | | Bool | Updates progress based on Time
mainBkg | | String | Background color for main chart area
titleBkg | | String | Background color for title
titleStyle |  | Object | Style for title text (SVG Text).
dotStyle |  | Object | Style for dots (SVG Circles).
dotCompleteStyle |  | Object | Style for dots that have been passed/completed.
goalDotStyle |  | Object | Style for goal Dot.
goalCompleteDotStyle |  | Object | Style for goal Dot when reached.
progressStyle |  | Object | Style for progress bar (SVG rect)
style |  | Object | Style that is passed to Chart (div).
wrapStyle |  | Object | Style for wrapper div (div).
