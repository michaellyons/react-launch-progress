module.exports = [
  {
    key: 'width',
    type: 'string|number',
    default: '400',
    desc: 'Width of the Container div'
  },
  {
    key: 'height',
    default: '170',
    type: 'string|number',
    desc: 'Height of the Container div'
  },
  {
    key: 'id',
    type: 'string',
    default: '',
    desc: 'The string id applied to the SVG component',
  },
  {
    key: 'title',
    type: 'string',
    desc: 'Title of the Chart.'
  },
  {
    key: 'progressColor',
    type: 'string',
    default: '#FFFFFFF',
    desc: 'The color of the primary Line. (Default is white.)',
  },
  {
    key: 'mainBkg',
    type: 'string',
    default: '#FFFFFFF',
    desc: 'The color of chart body.',
  },
  {
    key: 'titleBkg',
    type: 'string',
    default: '#FFFFFFF',
    desc: 'The color of title styled shape.',
  },
  {
    key: 'showLabels',
    type: 'bool',
    default: 'true',
    desc: 'Determines if Labels are shown.',
  },
  {
    key: 'showTicks',
    type: 'bool',
    default: 'true',
    desc: 'Determines if Ticks are shown.',
  },
  {
    key: 'showDots',
    type: 'bool',
    default: 'true',
    desc: 'Determines if Dots are shown.',
  },
  {
    key: 'margin',
    type: 'object',
    default: `(See Description)`,
    desc: 'Margin between container and chart. <br /> Default: ```{ top: 10, left: 10, bottom: 20, right: 25 }```',
  },
  {
    key: 'style',
    type: 'object',
    default: ``,
    desc: 'Override the default Chart style object.',
  },
  {
    key: 'titleStyle',
    type: 'object',
    default: ``,
    desc: 'Override the default Title style object.',
  },
  {
    key: 'containerStyle',
    type: 'object',
    default: ``,
    desc: 'Override the default container style object.',
  },
  {
    key: 'dotStyle',
    type: 'object',
    default: ``,
    desc: 'Override the default dot style object.',
  },
  {
    key: 'dotCompleteStyle',
    type: 'object',
    default: ``,
    desc: 'Override the completed dots\'s style object.',
  },
  {
    key: 'goalDotStyle',
    type: 'object',
    default: ``,
    desc: 'Override the goal dot\'s style object.',
  },
  {
    key: 'goalCompleteDotStyle',
    type: 'object',
    default: ``,
    desc: 'Override the completed goal dots\'s style object.',
  }
]
