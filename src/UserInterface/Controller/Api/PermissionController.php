<?php

namespace App\UserInterface\Controller\Api;

use App\Domain\Entity\Permission;
use App\Domain\Repository\PermissionRepositoryInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/permissions', name: 'api_permissions_')]
class PermissionController extends AbstractController
{
    public function __construct(
        private PermissionRepositoryInterface $permissionRepository
    ) {}

    #[Route('', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $permissions = $this->permissionRepository->findAll();
        $data = [];
        foreach ($permissions as $permission) {
            $data[] = [
                'id' => $permission->getId(),
                'name' => $permission->getName(),
                'description' => $permission->getDescription(),
            ];
        }
        return $this->json($data);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);
        $permission = new Permission($payload['name'], $payload['description'] ?? null);

        $this->permissionRepository->save($permission);
        return $this->json(['status' => 'Permission created'], Response::HTTP_CREATED);
    }
}
