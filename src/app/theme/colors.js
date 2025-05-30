import colorUtil from 'color' 

const states = {
  strong: 0.85,
  muted: 0.64,
  inactive: 0.5,
  disable: 0.32,
  active: 0.16,
  enabled: 0.08,
  modal: 0.25,
} 

const getThemeColor = color => {
  const main = colorUtil(color) 
  const variants = Object.entries(states).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: main.alpha(value).toString(),
    } 
  }, {}) 
  return {
    main: main.toString(),
    ...variants,
  } 
} 

const contrast = getThemeColor('#FFFFFF') 
const primary = getThemeColor('#4F0010') 
const text = getThemeColor('#000000') 
const background = getThemeColor('#FCFCFC')
const grey = getThemeColor('#D0D0D0')

const colors = {
  contrast,
  primary,
  text,
  background,
  grey,
}

export default colors