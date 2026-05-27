<?php

namespace App\Domain\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

class Playlist
{
    private ?int $id = null;
    private ProgramSlot $programSlot;
    private \DateTimeImmutable $date;
    private string $status = 'draft'; // 'draft', 'to_validate', 'validated'
    private Collection $items;

    public function __construct(ProgramSlot $programSlot, \DateTimeImmutable $date)
    {
        $this->programSlot = $programSlot;
        $this->date = $date;
        $this->items = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getProgramSlot(): ProgramSlot
    {
        return $this->programSlot;
    }

    public function getDate(): \DateTimeImmutable
    {
        return $this->date;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): void
    {
        $this->status = $status;
    }

    /**
     * @return Collection<int, PlaylistItem>
     */
    public function getItems(): Collection
    {
        return $this->items;
    }

    public function addItem(PlaylistItem $item): void
    {
        if (!$this->items->contains($item)) {
            $this->items->add($item);
            $item->setPlaylist($this);
        }
    }

    public function removeItem(PlaylistItem $item): void
    {
        if ($this->items->removeElement($item)) {
            if ($item->getPlaylist() === $this) {
                $item->setPlaylist(null);
            }
        }
    }
}
