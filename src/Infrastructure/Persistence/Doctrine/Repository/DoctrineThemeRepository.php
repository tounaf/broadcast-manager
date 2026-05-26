<?php

namespace App\Infrastructure\Persistence\Doctrine\Repository;

use App\Domain\Entity\Theme;
use App\Domain\Repository\ThemeRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Theme>
 */
class DoctrineThemeRepository extends ServiceEntityRepository implements ThemeRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Theme::class);
    }

    public function save(Theme $theme): void
    {
        $this->getEntityManager()->persist($theme);
        $this->getEntityManager()->flush();
    }

    public function remove(Theme $theme): void
    {
        $this->getEntityManager()->remove($theme);
        $this->getEntityManager()->flush();
    }

    public function findById(int $id): ?Theme
    {
        return $this->find($id);
    }
}
