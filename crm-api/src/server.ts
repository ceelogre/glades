import Fastify from 'fastify'

interface Customer {
  id: number
  name: string
  email: string
  phone?: string
}

const fastify = Fastify({ logger: true })

let customers: Customer[] = [
  { id: 1, name: 'Acme Corp', email: 'contact@acme.com', phone: '555-0100' },
  { id: 2, name: 'TechStart Inc', email: 'hello@techstart.com' }
]

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

// POST new customer
fastify.post<{ Body: Omit<Customer, 'id'> }>('/customers', async (request, reply) => {
  const newCustomer: Customer = {
    id: Math.max(...customers.map(c => c.id), 0) + 1,
    ...request.body
  }
  customers.push(newCustomer)
  return reply.code(201).send(newCustomer)
})

// PUT update customer
fastify.put<{ Params: { id: string }, Body: Partial<Customer> }>(
  '/customers/:id',
  async (request, reply) => {
    const id = parseInt(request.params.id)
    const index = customers.findIndex(c => c.id === id)
    
    if (index === -1) {
      return reply.code(404).send({ error: 'Customer not found' })
    }
    
    const existing = customers[index]!
    const updatedCustomer: Customer = {
      id,
      name: request.body.name ?? existing.name,
      email: request.body.email ?? existing.email,
      ...(request.body.phone !== undefined ? { phone: request.body.phone } : existing.phone !== undefined ? { phone: existing.phone } : {})
    }
    customers[index] = updatedCustomer
    return updatedCustomer
  }
)

// DELETE customer
fastify.delete<{ Params: { id: string } }>('/customers/:id', async (request, reply) => {
  const id = parseInt(request.params.id)
  const index = customers.findIndex(c => c.id === id)
  
  if (index === -1) {
    return reply.code(404).send({ error: 'Customer not found' })
  }
  
  customers.splice(index, 1)
  return reply.code(204).send()
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