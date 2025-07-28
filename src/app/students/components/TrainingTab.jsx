import { Stack, Typography as T } from '@mui/material'
import { useApiQuery } from '~/app/Lib/apiFetch'
import Card from './Card'
import Loading from '~/app/UI/shared/Loading'

export const TrainingTab = ({ 
  handleMenuOpen,
  handleOpenInfoModal,
  status,
  confirmed,
  handleConfirm,
  permitted
}) => {
  const { data: trainingData, isLoading, error } = useApiQuery({ path: 'training' })
  const trainings = Object.values(trainingData ?? [])

  if (isLoading) return <Loading/>

  if(error) return <T>No existen elementos</T>

  return (
    <Stack direction="row" flexWrap="wrap" useFlexGap spacing={5} rowGap={3}>
      {trainings.map((training, index) => (
        <Card 
          key={index}
          id={training.id}
          data={training}
          handleMenuOpen={handleMenuOpen} 
          handleClick={status === 'selecting'
            ? () => handleConfirm(training.id, training.groupNumber)
            : () => handleOpenInfoModal(training)} 
          status={status}
          confirmed={confirmed}
          isAdmin={permitted}
        />
      ))}
    </Stack>
  )
}