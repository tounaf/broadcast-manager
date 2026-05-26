<?php

namespace App\Domain\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    private ?int $id = null;
    private string $username;
    private string $email;
    private string $password;
    private Collection $userRoles;

    public function __construct(string $username, string $email)
    {
        $this->username = $username;
        $this->email = $email;
        $this->userRoles = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): string
    {
        return $this->username;
    }

    public function setUsername(string $username): void
    {
        $this->username = $username;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): void
    {
        $this->email = $email;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): void
    {
        $this->password = $password;
    }

    /**
     * @return Collection<int, Role>
     */
    public function getUserRoles(): Collection
    {
        return $this->userRoles;
    }

    public function addRole(Role $role): void
    {
        if (!$this->userRoles->contains($role)) {
            $this->userRoles->add($role);
        }
    }

    public function removeRole(Role $role): void
    {
        $this->userRoles->removeElement($role);
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = [];
        foreach ($this->userRoles as $role) {
            $roles[] = 'ROLE_' . strtoupper($role->getName());
        }
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
    }

    /**
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return $this->username;
    }
}
