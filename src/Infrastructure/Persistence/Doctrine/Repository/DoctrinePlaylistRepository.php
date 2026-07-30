<?php

namespace App\Infrastructure\Persistence\Doctrine\Repository;

use App\Domain\Entity\Playlist;
use App\Domain\Entity\ProgramSlot;
use App\Domain\Repository\PlaylistRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Playlist>
 */
class DoctrinePlaylistRepository extends ServiceEntityRepository implements PlaylistRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Playlist::class);
    }

    public function save(Playlist $playlist): void
    {
        $this->getEntityManager()->persist($playlist);
        $this->getEntityManager()->flush();
    }

    public function remove(Playlist $playlist): void
    {
        $this->getEntityManager()->remove($playlist);
        $this->getEntityManager()->flush();
    }

    public function findById(int $id): ?Playlist
    {
        return $this->find($id);
    }

    public function findBySlotAndDate(ProgramSlot $slot, \DateTimeImmutable $date): ?Playlist
    {
        return $this->findOneBy([
            'programSlot' => $slot,
            'date' => $date
        ]);
    }

    public function findByDate(\DateTimeImmutable $date): array
    {
        return $this->findBy(['date' => $date]);
    }

    public function findBroadcastedMediaIds(): array
    {
        $qb = $this->createQueryBuilder('p')
            ->select('DISTINCT m.id')
            ->join('p.items', 'pi')
            ->join('pi.media', 'm');

        $result = $qb->getQuery()->getScalarResult();
        return array_column($result, 'id');
    }
}
