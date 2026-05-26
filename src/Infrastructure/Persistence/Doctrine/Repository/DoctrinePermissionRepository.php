<?php

namespace App\Infrastructure\Persistence\Doctrine\Repository;

use App\Domain\Entity\Permission;
use App\Domain\Repository\PermissionRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Permission>
 */
class DoctrinePermissionRepository extends ServiceEntityRepository implements PermissionRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Permission::class);
    }

    public function save(Permission $permission): void
    {
        $this->getEntityManager()->persist($permission);
        $this->getEntityManager()->flush();
    }

    public function remove(Permission $permission): void
    {
        $this->getEntityManager()->remove($permission);
        $this->getEntityManager()->flush();
    }

    public function findById(int $id): ?Permission
    {
        return $this->find($id);
    }

    public function findByName(string $name): ?Permission
    {
        return $this->findOneBy(['name' => $name]);
    }
}
