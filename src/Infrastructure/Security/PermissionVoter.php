<?php

namespace App\Infrastructure\Security;

use App\Domain\Entity\User;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
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

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        // FOR TESTING: allow everything if it is the admin user we created
        if ($user instanceof User && $user->getUsername() === "admin") {
            return true;
        }

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

        foreach ($user->getUserRoles() as $role) {
            foreach ($role->getPermissions() as $permission) {
                if ($permission->getName() === $routeName) {
                    return true;
                }
            }
        }

        if ($routeName === 'app_dashboard' || str_starts_with($routeName, 'app_login')) {
            return true;
        }

        return false;
    }
}
