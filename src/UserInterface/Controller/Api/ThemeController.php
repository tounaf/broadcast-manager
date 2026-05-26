<?php

namespace App\UserInterface\Controller\Api;

use App\Domain\Entity\Theme;
use App\Domain\Repository\ThemeRepositoryInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/themes', name: 'api_themes_')]
class ThemeController extends AbstractController
{
    public function __construct(
        private ThemeRepositoryInterface $repository
    ) {}

    #[Route('', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $themes = $this->repository->findAll();
        
        $data = array_map(fn(Theme $theme) => [
            'id' => $theme->getId(),
            'label' => $theme->getLabel(),
            'color' => $theme->getColor(),
        ], $themes);

        return $this->json($data);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['label']) || empty($data['color'])) {
            return $this->json(['error' => 'Label and color are required'], Response::HTTP_BAD_REQUEST);
        }

        $theme = new Theme($data['label'], $data['color']);
        $this->repository->save($theme);

        return $this->json([
            'id' => $theme->getId(),
            'label' => $theme->getLabel(),
            'color' => $theme->getColor(),
            'message' => 'Theme created successfully'
        ], Response::HTTP_CREATED);
    }
}
