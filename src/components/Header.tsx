import { HStack, Heading, IconButton, StyledProps, useTheme } from 'native-base'
import { CaretLeft } from 'phosphor-react-native'

type Props = StyledProps & {
  title: string
}

export function Header({ title, ...rest }: Props) {
  const { colors } = useTheme()

  return (
    <HStack
      w="full"
      justifyContent="space-between"
      alignItems="center"
      bg="gray.600"
      pb={6}
      pt={12}
      {...rest}
    >
      <IconButton as={<CaretLeft color={colors.gray[300]} />} size={24} />
      <Heading
        color="gray.100"
        fontSize="lg"
        textAlign="center"
        flex={1}
        ml={-6}
      >
        {title}
      </Heading>
    </HStack>
  )
}
