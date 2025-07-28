import { Stack, Typography as T } from '@mui/material'
import { useApiQuery } from '~/app/Lib/apiFetch'
import Card from './Card'
import Loading from '~/app/UI/shared/Loading'

export const ClubTab = ({ 
  handleMenuOpen,
  handleOpenInfoModal,
  status,
  confirmed,
  handleConfirm,
  permitted
}) => {
  const { data: clubData, isLoading, error } = useApiQuery({ path: 'club' })
  const clubs = Object.values(clubData ?? [])

  if (isLoading) return <Loading/>

  if(error) return <T>No existen elementos</T>

  return (
    <Stack direction="row" flexWrap="wrap" useFlexGap spacing={5} rowGap={3}>
      {clubs.map((club, index) => (
        <Card 
          key={index}
          id={club.id}
          data={club}
          handleMenuOpen={handleMenuOpen} 
          handleClick={status === 'selecting'
            ? () => handleConfirm(club.id, club.groupNumber)
            : () => handleOpenInfoModal(club)} 
          status={status}
          confirmed={confirmed}
          isAdmin={permitted}
        />
      ))}
    </Stack>
  )
}