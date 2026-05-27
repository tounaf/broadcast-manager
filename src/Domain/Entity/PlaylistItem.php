<?php

namespace App\Domain\Entity;

class PlaylistItem
{
    private ?int $id = null;
    private ?Playlist $playlist = null;
    private Media $media;
    private int $position;

    public function __construct(Media $media, int $position)
    {
        $this->media = $media;
        $this->position = $position;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPlaylist(): ?Playlist
    {
        return $this->playlist;
    }

    public function setPlaylist(?Playlist $playlist): void
    {
        $this->playlist = $playlist;
    }

    public function getMedia(): Media
    {
        return $this->media;
    }

    public function getPosition(): int
    {
        return $this->position;
    }

    public function setPosition(int $position): void
    {
        $this->position = $position;
    }
}
