<?php

namespace App\Domain\Entity;

class Theme
{
    private ?int $id = null;
    private string $label;
    private string $color; // Hex or Tailwind class

    public function __construct(string $label, string $color)
    {
        $this->label = $label;
        $this->color = $color;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLabel(): string
    {
        return $this->label;
    }

    public function setLabel(string $label): void
    {
        $this->label = $label;
    }

    public function getColor(): string
    {
        return $this->color;
    }

    public function setColor(string $color): void
    {
        $this->color = $color;
    }
}
