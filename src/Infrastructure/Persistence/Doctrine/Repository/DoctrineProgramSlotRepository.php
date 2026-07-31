<?php

namespace App\Infrastructure\Persistence\Doctrine\Repository;

use App\Domain\Entity\ProgramSlot;
use App\Domain\Repository\ProgramSlotRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ProgramSlot>
 */
class DoctrineProgramSlotRepository extends ServiceEntityRepository implements ProgramSlotRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ProgramSlot::class);
    }

    public function save(ProgramSlot $programSlot): void
    {
        $this->getEntityManager()->persist($programSlot);
        $this->getEntityManager()->flush();
    }

    public function remove(ProgramSlot $programSlot): void
    {
        $this->getEntityManager()->remove($programSlot);
        $this->getEntityManager()->flush();
    }

    public function findById(int $id): ?ProgramSlot
    {
        return $this->find($id);
    }

    public function findByDay(string $dayOfWeek): array
    {
        return $this->findBy(['dayOfWeek' => $dayOfWeek]);
    }

    /**
     * @return ProgramSlot[]
     */
    public function findByDateRange(\DateTimeInterface $start, \DateTimeInterface $end): array
    {
        return $this->createQueryBuilder('s')
            ->where('s.date IS NULL')
            ->orWhere('s.date >= :start AND s.date <= :end')
            ->setParameter('start', $start->format('Y-m-d'))
            ->setParameter('end', $end->format('Y-m-d'))
            ->getQuery()
            ->getResult();
    }
}
