<?php

namespace App\Domain\Repository;

use App\Domain\Entity\Permission;

interface PermissionRepositoryInterface
{
    public function save(Permission $permission): void;
    public function remove(Permission $permission): void;
    public function findById(int $id): ?Permission;
    public function findByName(string $name): ?Permission;
    public function findAll();
}
