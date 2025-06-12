import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.produto.createMany({
    data: [
      {
        id: 'produto1',
        name: 'Camiseta Dev',
        price: 49.9,
        fornecedor: 'Fornecedor A',
      },
      {
        id: 'produto2',
        name: 'Mouse Gamer',
        price: 129.9,
        fornecedor: 'Fornecedor B',
      },
    ],
  });

  console.log('Produtos inseridos!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
