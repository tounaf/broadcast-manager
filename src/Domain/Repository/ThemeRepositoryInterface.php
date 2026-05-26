<?php

namespace App\Domain\Repository;

use App\Domain\Entity\Theme;

interface ThemeRepositoryInterface
{
    public function save(Theme $theme): void;
    public function remove(Theme $theme): void;
    public function findById(int $id): ?Theme;
    /** @return Theme[] */
    public function findAll();
}
