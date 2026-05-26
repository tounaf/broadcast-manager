<?php

namespace App\Domain\Entity;

class ProgramSlot
{
    private ?int $id = null;
    private string $dayOfWeek; // 'Monday', 'Tuesday', etc.
    private string $label;
    private \DateTimeImmutable $startTime;
    private \DateTimeImmutable $endTime;
    private string $theme;
    private bool $isValidated = false;

    public function __construct(
        string $dayOfWeek,
        string $label,
        \DateTimeImmutable $startTime,
        \DateTimeImmutable $endTime,
        string $theme
    ) {
        $this->dayOfWeek = $dayOfWeek;
        $this->label = $label;
        $this->startTime = $startTime;
        $this->endTime = $endTime;
        $this->theme = $theme;
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

    public function getDayOfWeek(): string
    {
        return $this->dayOfWeek;
    }

    public function setDayOfWeek(string $dayOfWeek): void
    {
        $this->dayOfWeek = $dayOfWeek;
    }

    public function getStartTime(): \DateTimeImmutable
    {
        return $this->startTime;
    }

    public function setStartTime(\DateTimeImmutable $startTime): void
    {
        $this->startTime = $startTime;
    }

    public function getEndTime(): \DateTimeImmutable
    {
        return $this->endTime;
    }

    public function setEndTime(\DateTimeImmutable $endTime): void
    {
        $this->endTime = $endTime;
    }

    public function getTheme(): string
    {
        return $this->theme;
    }

    public function setTheme(string $theme): void
    {
        $this->theme = $theme;
    }

    public function isValidated(): bool
    {
        return $this->isValidated;
    }

    public function validate(): void
    {
        $this->isValidated = true;
    }

    public function invalidate(): void
    {
        $this->isValidated = false;
    }
}
