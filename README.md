# react-launch-timeline


[![PeerDependencies](https://img.shields.io/david/peer/michaellyons/react-launch-timeline.svg?style=flat-square)](https://david-dm.org/michaellyons/react-launch-timeline#info=peerDependencies&view=list)
[![Dependencies](https://img.shields.io/david/michaellyons/react-launch-timeline.svg?style=flat-square)](https://david-dm.org/michaellyons/react-launch-timeline)
[![DevDependencies](https://img.shields.io/david/dev/michaellyons/react-launch-timeline.svg?style=flat-square)](https://david-dm.org/michaellyons/react-launch-timeline#info=devDependencies&view=list)



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
    date: '2017-04-23'
  },
  {
    name: 'Startup',
    date: '2017-04-24'
  },
  {
    name: 'Launch',
    date: '2017-04-25'
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
data | Y | [Object] | Objects with date key and name for labels.
height | | Integer/String | This will set the total height of the chart.
xData | | String | Optional override date key for data objects.
timed | | Bool | Updates progress based on Time
dotStyle |  | Object | Style for dots (SVG Circles).
dotCompleteStyle |  | Object | Style for dots that have been passed/completed.
goalStyle |  | Object | Style for goal Dot.
goalCompleteStyle |  | Object | Style for goal Dot when reached.
