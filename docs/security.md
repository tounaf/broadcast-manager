# Security and Users

This document describes how security and users are managed in the application.

## User Creation via CLI

You can create a new user using the following Symfony command:

```bash
php bin/console app:user:create <username> <email> <password>
```

### Arguments:
- `username`: The unique username for the user.
- `email`: The email address of the user.
- `password`: The plain-text password (it will be hashed before being saved).

### Example:
```bash
php bin/console app:user:create admin admin@example.com password123
```

## Architecture

- **Entity**: `App\Domain\Entity\User`
- **Repository Interface**: `App\Domain\Repository\UserRepositoryInterface`
- **Command**: `App\UserInterface\Command\CreateUserCommand`
- **Voter**: `App\Infrastructure\Security\PermissionVoter`
