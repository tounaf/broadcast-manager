<?php

namespace App\Domain\Repository;

use App\Domain\Entity\Media;

interface MediaRepositoryInterface
{
    public function save(Media $media): void;
    public function remove(Media $media): void;
    public function findById(int $id): ?Media;
    public function findAll();
}
