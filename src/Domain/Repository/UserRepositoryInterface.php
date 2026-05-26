<?php

namespace App\Domain\Repository;

use App\Domain\Entity\User;

interface UserRepositoryInterface
{
    public function save(User $user): void;
    public function remove(User $user): void;
    public function findById(int $id): ?User;
    public function findByUsername(string $username): ?User;
    public function findAll();
}
