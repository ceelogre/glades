import Fastify from 'fastify'

interface Customer {
  id: number
  name: string
  email: string
  phone?: string
  productIds: string[]
}

const fastify = Fastify({ logger: true })

// Simple seed data: 10 customers, each associated with 1–2 products (IDs from the inventory service)
const allProductIds = ['1', '2', '3', '4', '5', '6']

let customers: Customer[] = Array.from({ length: 10 }, (_, i) => {
  const id = i + 1
  const primaryProduct = allProductIds[i % allProductIds.length]!
  const secondaryProduct = allProductIds[(i + 1) % allProductIds.length]!

  const productIds =
    id % 2 === 0 ? [primaryProduct, secondaryProduct] : [primaryProduct]

  return {
    id,
    name: `Customer ${id}`,
    email: `customer${id}@example.com`,
    phone: `0788${String(id).padStart(2, '0')}`,
    productIds
  }
})
console.info(customers)

// GET all customers
fastify.get('/customers', async (request, reply) => {
  return customers
})

// GET single customer
fastify.get<{ Params: { id: string } }>('/customers/:id', async (request, reply) => {
  const customer = customers.find(c => c.id === parseInt(request.params.id))
  if (!customer) {
    return reply.code(404).send({ error: 'Customer not found' })
  }
  return customer
})

// Add new customer
fastify.post<{ Body: Omit<Customer, 'id'> }>('/customers', async (request, reply) => {
  const newCustomer: Customer = {
    id: Math.max(...customers.map(c => c.id), 0) + 1,
    ...request.body
  }
  customers.push(newCustomer)
  return reply.code(201).send(newCustomer)
})



const start = async () => {
  try {
    const port = Number(process.env.PORT ?? 8081)
    await fastify.listen({ port, host: '0.0.0.0' })
    console.log(`Server running on http://localhost:${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()