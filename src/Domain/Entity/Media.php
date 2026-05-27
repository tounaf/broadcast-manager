<?php

namespace App\Domain\Entity;

class Media
{
    private ?int $id = null;
    private string $title;
    private int $duration; // in seconds
    private string $type; // 'film', 'clip', 'pub', 'filler'

    public function __construct(string $title, int $duration, string $type)
    {
        $this->title = $title;
        $this->duration = $duration;
        $this->type = $type;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): void
    {
        $this->title = $title;
    }

    public function getDuration(): int
    {
        return $this->duration;
    }

    public function setDuration(int $duration): void
    {
        $this->duration = $duration;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function setType(string $type): void
    {
        $this->type = $type;
    }
}
