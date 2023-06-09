import { useEffect, useState } from 'react'
import { Alert } from 'react-native'

import { Box, HStack, ScrollView, Text, VStack, useTheme } from 'native-base'
import firestore from '@react-native-firebase/firestore'
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO'
import { dateFormat } from '@utils/firestoreDateformat'

import { useNavigation, useRoute } from '@react-navigation/native'

import { Header } from '@components/Header'
import { OrderProps } from '@components/Order'
import { Loading } from '@components/Loading'
import {
  CircleWavyCheck,
  Hourglass,
  DesktopTower,
  ClipboardText,
} from 'phosphor-react-native'
import { CardDetails } from '@components/CardDetails'
import { Input } from '@components/Input'
import { Button } from '@components/Button'

type RouteParams = {
  orderId: string
}

type OrderDetails = OrderProps & {
  description: string
  solution: string
  closed: string
}

export function Details() {
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails)
  const [solution, setSolution] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const route = useRoute()
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { orderId } = route.params as RouteParams

  function handleOrderClose() {
    if (!solution) {
      return Alert.alert('Solicitação', 'Informe a solução para encerrar')
    }

    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .update({
        status: 'closed',
        solution,

        closed_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => navigation.goBack())
      .catch((error) => {
        console.log(error)
        Alert.alert('Solicitação', 'Não foi possível finalizar a solicitação')
      })
  }

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO | any>('orders')
      .doc(orderId)
      .get()
      .then((doc) => {
        const {
          patrimony,
          description,
          status,
          solution,
          created_at,
          closed_at,
        } = doc.data()

        const closed = closed_at ? String(dateFormat(closed_at)) : null

        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          when: String(dateFormat(created_at)),
          closed: closed ?? '',
          solution,
        })

        setIsLoading(false)
      })
  }, [orderId])

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600">
        <Header title="solicitação" />
      </Box>
      <HStack bg="gray.500" justifyContent="center" p={4}>
        {order.status === 'closed' ? (
          <CircleWavyCheck size={22} color={colors.green[300]} />
        ) : (
          <Hourglass size={22} color={colors.secondary[700]} />
        )}

        <Text
          fontSize="sm"
          color={
            order.status === 'closed'
              ? colors.green[300]
              : colors.secondary[700]
          }
          ml={2}
          textTransform="uppercase"
        >
          {order.status === 'closed' ? 'finalizado' : 'em andamento'}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="equipamento"
          description={`Património: ${order.patrimony}`}
          icon={DesktopTower}
        />

        <CardDetails
          title="descrição do problema"
          description={order.description}
          icon={ClipboardText}
          footer={`Registrado em ${order.when}`}
        />
        <CardDetails
          title="solução"
          icon={CircleWavyCheck}
          description={order.solution}
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          {order.status === 'open' && (
            <Input
              placeholder="descrição da solução"
              onChangeText={setSolution}
              textAlignVertical="top"
              bg="gray.600"
              multiline
              h={24}
            />
          )}
        </CardDetails>
      </ScrollView>
      {order.status === 'open' && (
        <Button title="Encerrar solicitação" m={5} onPress={handleOrderClose} />
      )}
    </VStack>
  )
}
