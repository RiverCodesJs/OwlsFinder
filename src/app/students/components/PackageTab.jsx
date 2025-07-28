import { Stack, Typography as T } from '@mui/material'
import { useApiQuery } from '~/app/Lib/apiFetch'
import Card from './Card'
import Loading from '~/app/UI/shared/Loading'

export const PackageTab = ({ 
  handleMenuOpen,
  handleOpenInfoModal,
  status,
  confirmed,
  handleConfirm,
  permitted
}) => {
  const { data: packageData, isLoading, error } = useApiQuery({ path: 'package' })
  const packages = Object.values(packageData ?? [])

  if (isLoading) return <Loading/>

  if(error) return <T>No existen elementos</T>

  return (
    <Stack direction="row" flexWrap="wrap" useFlexGap spacing={5} rowGap={3}>
      {packages.map((pack, index) => (
        <Card 
          key={index}
          id={pack.id}
          data={pack}
          handleMenuOpen={handleMenuOpen} 
          handleClick={status === 'selecting'
            ? () => handleConfirm(pack.id, pack.groupNumber)
            : () => handleOpenInfoModal(pack)} 
          status={status}
          confirmed={confirmed}
          isAdmin={permitted}
        />
      ))}
    </Stack>
  )
}