'use client'
import { Typography } from '@mui/material'
import { DateTime } from 'luxon'

const DateDisplay = () => {
  const date = DateTime.now()

  return (
    <box style={{ margin: '2rem' }}>
      <Typography variant="h5">Luxon Date Display Example</Typography>
      
      <Typography variant="body1" style={{ marginTop: '1rem' }}>
        Full Date Format: {date.toLocaleString(DateTime.DATETIME_FULL)}
      </Typography>
      <Typography variant="body1" style={{ marginTop: '0.5rem' }}>
        Short Date Format: {date.toLocaleString(DateTime.DATE_SHORT)}
      </Typography>
      <Typography variant="body1" style={{ marginTop: '0.5rem' }}>
        Time Format: {date.toLocaleString(DateTime.TIME_SIMPLE)}
      </Typography>
      
    </box>
  )
}

export default DateDisplay
