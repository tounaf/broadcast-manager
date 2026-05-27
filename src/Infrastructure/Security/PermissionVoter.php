<?php

namespace App\Infrastructure\Security;

use App\Domain\Entity\User;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Vote;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class PermissionVoter extends Voter
{
    public const ACCESS = 'ROUTE_ACCESS';

    private RequestStack $requestStack;

    public function __construct(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
    }

    protected function supports(string $attribute, mixed $subject): bool
    {
        return $attribute === self::ACCESS;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token, ?Vote $vote = null): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        $request = $this->requestStack->getCurrentRequest();
        if (!$request) {
            return false;
        }

        $routeName = $request->attributes->get('_route');
        if (!$routeName) {
            return true;
        }

        // Check if any of the user's roles have the permission for this route
        foreach ($user->getUserRoles() as $role) {
            foreach ($role->getPermissions() as $permission) {
                if ($permission->getName() === $routeName) {
                    return true;
                }
            }
        }

        // Always allow dashboard and login-related routes to avoid locking out users
        if ($routeName === 'app_dashboard' || str_starts_with($routeName, 'app_login')) {
            return true;
        }

        return false;
    }
}
