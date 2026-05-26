<?php

namespace App\Domain\Repository;

use App\Domain\Entity\Role;

interface RoleRepositoryInterface
{
    public function save(Role $role): void;
    public function remove(Role $role): void;
    public function findById(int $id): ?Role;
    public function findByName(string $name): ?Role;
    public function findAll();
}
