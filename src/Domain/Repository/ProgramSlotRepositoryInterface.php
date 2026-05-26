<?php

namespace App\Domain\Repository;

use App\Domain\Entity\ProgramSlot;

interface ProgramSlotRepositoryInterface
{
    public function save(ProgramSlot $programSlot): void;
    public function remove(ProgramSlot $programSlot): void;
    public function findById(int $id): ?ProgramSlot;
    /** @return ProgramSlot[] */
    public function findAll(): array;
    /** @return ProgramSlot[] */
    public function findByDay(string $dayOfWeek): array;
}
