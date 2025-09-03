'use client'
import { MoreVert } from '@mui/icons-material'
import { Button, IconButton, Radio, Stack, Typography as T } from '@mui/material'
import { styled } from '@mui/material/styles'
import Image from 'next/image'

import { buhosLogo } from '~/app/images'
import getClassPrefixer from '~/app/UI/classPrefixer'

const displayName = 'Card'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  height: 170,
  width: 300,
  position: 'relative',
  '@media(max-width: 768px)': {
    width: 400,
  },
  [`& .${classes.cardButton}`]: {
    position: 'absolute',
    zIndex: 0, 
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&.Mui-disabled': {
      opacity: '0.5'
    },
    '&:hover': {
      [`& .${classes.cardDescription}`]: {
        backgroundColor: theme.palette.primary.main
      }
    }
  },
  [`& .${classes.imageContainer}`]: {
    borderRadius: '4px 4px 0 0',
    overflow: 'hidden',
    position: 'relative',
    width: 300,
    height: 120,
    '@media(max-width: 768px)': {
      width: '100%',
    },
  },
  [`& .${classes.cardImage}`]: {
    objectFit: 'cover',
  },
  [`& .${classes.cardDescription}`]: {
    width: 300,
    padding: '0.5rem',
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.contrast.main,
    display: 'flex',
    justifyContent: 'space-between',
    borderRadius: '0 0 4px 4px',
    textAlign: 'left',
    transition: 'background-color 0.3s ease',
    '@media(max-width: 768px)': {
      width: '100%',
    },
  },
  [`& .${classes.menuButton}`]: {
    zIndex: 1,
    top: 125,
    left: 250,
  },
  '& .MuiButtonBase-root': {
    textTransform: 'none',
  },
  '& .MuiButton-root': {
    padding: 0,
  },
  '& .MuiRadio-root': {
    color: theme.palette.contrast.main,
    '&.Mui-checked': {
      color: theme.palette.contrast.main
    }
  },
}))

const Card = ({ 
  id,
  data,
  handleMenuOpen, 
  handleClick, 
  isAdmin, 
  status,
  confirmed,
}) => {
  const title = 'Titulo de prueba', subtitle = 'John Doe'

  return (
    <Container>
      <Button className={classes.cardButton} onClick={handleClick} disabled={confirmed?.id !== id && confirmed != null}>
        <div className={classes.imageContainer}>
          <Image 
            className={classes.cardImage} 
            src={data?.images[0] ?? buhosLogo} 
            fill 
            sizes="(max-width: 768px) 33vw, 50vw"
            alt="placeholder img"
          />
        </div>
        <div className={classes.cardDescription}>
          <Stack alignItems="flex-start" justifyContent="center">
            <T variant="h6" fontWeight="bold">{data?.name ?? title}</T>
            { data?.professor?.name 
              ? <T variant="body2" color='grey.400'>Prof. {data?.professor?.name ?? subtitle}</T>
              : null}
          </Stack>
          {status === 'selecting'
            ? <Radio checked={confirmed?.id === id} value={id}/>
            : null
          }
        </div>
      </Button>
      {isAdmin && status !== 'selecting'
        ? <IconButton className={classes.menuButton} onClick={e => handleMenuOpen(e, data)}>
          <MoreVert color="contrast"/>
        </IconButton>
        : null
      }
    </Container>
  )
}

export default Card