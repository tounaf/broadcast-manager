<?php

namespace App\Domain\Repository;

use App\Domain\Entity\Playlist;
use App\Domain\Entity\ProgramSlot;

interface PlaylistRepositoryInterface
{
    public function save(Playlist $playlist): void;
    public function remove(Playlist $playlist): void;
    public function findById(int $id): ?Playlist;
    public function findBySlotAndDate(ProgramSlot $slot, \DateTimeImmutable $date): ?Playlist;
    public function findByDate(\DateTimeImmutable $date): array;
    /**
     * @return int[]
     */
    public function findBroadcastedMediaIdsBefore(\DateTimeImmutable $date): array;
}
