<?php

namespace App\UserInterface\Controller\Api;

use App\Domain\Entity\Role;
use App\Domain\Entity\Permission;
use App\Domain\Repository\RoleRepositoryInterface;
use App\Domain\Repository\PermissionRepositoryInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/roles', name: 'api_roles_')]
class RoleController extends AbstractController
{
    public function __construct(
        private RoleRepositoryInterface $roleRepository,
        private PermissionRepositoryInterface $permissionRepository
    ) {}

    #[Route('', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $roles = $this->roleRepository->findAll();
        $data = [];
        foreach ($roles as $role) {
            $data[] = [
                'id' => $role->getId(),
                'name' => $role->getName(),
                'permissions' => array_map(fn($p) => $p->getName(), $role->getPermissions()->toArray()),
            ];
        }
        return $this->json($data);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);
        $role = new Role($payload['name']);

        if (isset($payload['permissions']) && is_array($payload['permissions'])) {
            foreach ($payload['permissions'] as $permName) {
                $permission = $this->permissionRepository->findByName($permName);
                if (!$permission) {
                    $permission = new Permission($permName, "Auto-created for route $permName");
                    $this->permissionRepository->save($permission);
                }
                $role->addPermission($permission);
            }
        }

        $this->roleRepository->save($role);
        return $this->json(['status' => 'Role created'], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $role = $this->roleRepository->findById($id);
        if (!$role) return $this->json(['error' => 'Role not found'], 404);

        $payload = json_decode($request->getContent(), true);
        if (isset($payload['name'])) $role->setName($payload['name']);

        if (isset($payload['permissions']) && is_array($payload['permissions'])) {
            // Clear current permissions
            $currentPermissions = $role->getPermissions();
            foreach($currentPermissions as $p) $role->removePermission($p);

            // Add new permissions, auto-creating them if they don't exist
            foreach ($payload['permissions'] as $permName) {
                $permission = $this->permissionRepository->findByName($permName);
                if (!$permission) {
                    $permission = new Permission($permName, "Auto-created for route $permName");
                    $this->permissionRepository->save($permission);
                }
                $role->addPermission($permission);
            }
        }

        $this->roleRepository->save($role);
        return $this->json(['status' => 'Role updated']);
    }
}
