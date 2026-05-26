<?php

namespace App\Infrastructure\Persistence\Doctrine\Repository;

use App\Domain\Entity\Role;
use App\Domain\Repository\RoleRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Role>
 */
class DoctrineRoleRepository extends ServiceEntityRepository implements RoleRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Role::class);
    }

    public function save(Role $role): void
    {
        $this->getEntityManager()->persist($role);
        $this->getEntityManager()->flush();
    }

    public function remove(Role $role): void
    {
        $this->getEntityManager()->remove($role);
        $this->getEntityManager()->flush();
    }

    public function findById(int $id): ?Role
    {
        return $this->find($id);
    }

    public function findByName(string $name): ?Role
    {
        return $this->findOneBy(['name' => $name]);
    }
}
