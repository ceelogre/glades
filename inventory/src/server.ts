import Fastify from 'fastify'

interface Product {
  id: string
  name: string
  stock: number
}

const fastify = Fastify({ logger: true })

let products: Product[] = [
  { id: '1', name: 'Laptop', stock: 15 },
  { id: '2', name: 'Mouse', stock: 50 },
  { id: '3', name: 'Keyboard', stock: 30 }
]

// GET all products
fastify.get('/products', async (request, reply) => {
  return products
})

// GET single product
fastify.get<{ Params: { id: string } }>('/products/:id', async (request, reply) => {
  const product = products.find(p => p.id === request.params.id)
  if (!product) {
    return reply.code(404).send({ error: 'Product not found' })
  }
  return product
})

// POST new product
fastify.post<{ Body: Omit<Product, 'id'> }>('/products', async (request, reply) => {
  const newProduct: Product = {
    id: String(Math.max(...products.map(p => parseInt(p.id)), 0) + 1),
    ...request.body
  }
  products.push(newProduct)
  return reply.code(201).send(newProduct)
})

// PUT update product
fastify.put<{ Params: { id: string }, Body: Partial<Product> }>(
  '/products/:id',
  async (request, reply) => {
    const id = request.params.id
    const index = products.findIndex(p => p.id === id)
    
    if (index === -1) {
      return reply.code(404).send({ error: 'Product not found' })
    }
    
    const existing = products[index]!
    const updatedProduct: Product = {
      id,
      name: request.body.name ?? existing.name,
      stock: request.body.stock ?? existing.stock
    }
    products[index] = updatedProduct
    return updatedProduct
  }
)

// DELETE product
fastify.delete<{ Params: { id: string } }>('/products/:id', async (request, reply) => {
  const id = request.params.id
  const index = products.findIndex(p => p.id === id)
  
  if (index === -1) {
    return reply.code(404).send({ error: 'Product not found' })
  }
  
  products.splice(index, 1)
  return reply.code(204).send()
})

const start = async () => {
  try {
    await fastify.listen({ port: 8082 })
    console.log('Server running on http://localhost:8082')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
