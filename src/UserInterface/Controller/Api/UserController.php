<?php

namespace App\UserInterface\Controller\Api;

use App\Domain\Entity\User;
use App\Domain\Repository\UserRepositoryInterface;
use App\Domain\Repository\RoleRepositoryInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[Route('/api/users', name: 'api_users_')]
class UserController extends AbstractController
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private RoleRepositoryInterface $roleRepository,
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    #[Route('', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $users = $this->userRepository->findAll();
        $data = [];
        foreach ($users as $user) {
            $data[] = [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
                'email' => $user->getEmail(),
                'roles' => array_map(fn($r) => $r->getName(), $user->getUserRoles()->toArray()),
            ];
        }
        return $this->json($data);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);

        $user = new User($payload['username'], $payload['email']);
        if (!empty($payload['password'])) {
            $user->setPassword($this->passwordHasher->hashPassword($user, $payload['password']));
        }

        if (isset($payload['roles']) && is_array($payload['roles'])) {
            foreach ($payload['roles'] as $roleName) {
                $role = $this->roleRepository->findByName($roleName);
                if ($role) {
                    $user->addRole($role);
                }
            }
        }

        $this->userRepository->save($user);

        return $this->json(['status' => 'User created'], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $user = $this->userRepository->findById($id);
        if ($user) {
            $this->userRepository->remove($user);
        }
        return $this->json(['status' => 'User removed']);
    }
}
