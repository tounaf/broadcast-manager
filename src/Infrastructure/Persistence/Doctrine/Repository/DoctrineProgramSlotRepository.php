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
}
