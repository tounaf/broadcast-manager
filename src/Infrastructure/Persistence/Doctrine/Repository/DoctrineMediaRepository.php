<?php

namespace App\Infrastructure\Persistence\Doctrine\Repository;

use App\Domain\Entity\Media;
use App\Domain\Repository\MediaRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Media>
 */
class DoctrineMediaRepository extends ServiceEntityRepository implements MediaRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Media::class);
    }

    public function save(Media $media): void
    {
        $this->getEntityManager()->persist($media);
        $this->getEntityManager()->flush();
    }

    public function remove(Media $media): void
    {
        $this->getEntityManager()->remove($media);
        $this->getEntityManager()->flush();
    }

    public function findById(int $id): ?Media
    {
        return $this->find($id);
    }
}
