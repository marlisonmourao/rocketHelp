import { useNavigation } from '@react-navigation/native'
import { HStack, Heading, IconButton, StyledProps, useTheme } from 'native-base'
import { CaretLeft } from 'phosphor-react-native'

type Props = StyledProps & {
  title: string
}

export function Header({ title, ...rest }: Props) {
  const { colors } = useTheme()
  const navigation = useNavigation()

  function handleGoBack() {
    navigation.goBack()
  }

  return (
    <HStack
      w="full"
      alignItems="center"
      justifyContent="space-between"
      bg="gray.600"
      pb={6}
      pt={12}
      {...rest}
    >
      <IconButton
        icon={<CaretLeft color={colors.gray[200]} />}
        size={14}
        onPress={handleGoBack}
      />
      <Heading
        color="gray.100"
        fontSize="lg"
        textAlign="center"
        flex={1}
        mt={-1}
        ml={-10}
      >
        {title}
      </Heading>
    </HStack>
  )
}
