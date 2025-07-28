'use client'
import { MoreVert } from '@mui/icons-material'
import { Button, IconButton, Radio, Stack, Typography as T } from '@mui/material'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import { buhosLogo } from '~/app/images'
import getClassPrefixer from '~/app/UI/classPrefixer'

const displayName = 'ClubComponent'
const classes = getClassPrefixer(displayName)

const Container = styled('div')(({ theme }) => ({
  height: 170,
  width: 300,
  position: 'relative',
  '@media(max-width: 768px)': {
    width: 400
  }, 
  [`& .${classes.cardButton}`]: {
    position: 'absolute',
    zIndex: 0, 
    width: '100%',
    borderRadius: '4px 4px 0 0',
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
  [`& .${classes.cardDescription}`]: {
    width: '100%',
    padding: '0.5rem',
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.contrast.main,
    display: 'flex',
    justifyContent: 'space-between',
    borderRadius: '0 0 4px 4px',
    textAlign: 'left',
    transition: 'all 0.3s ease',
  },
  '& .MuiButtonBase-root': {
    textTransform: 'none',
  },
  '& [class*=MuiButton-root]': {
    padding: 0,
  },
  '& .MuiRadio-root': {
    color: theme.palette.contrast.main,
    '&.Mui-checked': {
      color: theme.palette.contrast.main
    }
  },
  [`& .${classes.menuButton}`]: {
    zIndex: 1,
    top: 125,
    left: 250,
    '@media(max-width: 768px)': {
      left: '80%'
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
        <Image src={data?.images[0] ?? buhosLogo} width={270} height={120} alt='placeholder img'/>
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